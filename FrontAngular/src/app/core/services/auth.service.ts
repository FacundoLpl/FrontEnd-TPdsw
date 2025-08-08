import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http" // Importar HttpErrorResponse
import { BehaviorSubject, Observable, of } from "rxjs"
import { tap, catchError, map } from "rxjs/operators"
import { Router } from "@angular/router"

interface AuthResponse {
  token: string
  id: string
  userType: string
  expiresIn: string
  firstName?: string
  lastName?: string
}

interface DecodedToken {
  id: string
  userType: string
  iat: number
  exp: number
  firstName?: string
  lastName?: string
}

interface UserInfo {
  id: string
  userType: string
  firstName?: string
  lastName?: string
  email?: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_ID_KEY = 'userId';
  private readonly USER_TYPE_KEY = 'userType';
  private readonly EXPIRES_AT_KEY = 'expires_at';
  private readonly USER_INFO_KEY = 'userInfo';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken())
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()
  private baseUrl = "http://localhost:3000/api"

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    return isAuth;
  }

  isAdmin(): boolean {
    const userType = this.getUserType()
    return userType === "Admin"
  }

  isMozo(): boolean {
    const userType = this.getUserType()
    return userType === "Mozo"
  }

  redirectIfNotAdmin(): void {
    if (!this.isAdmin()) {
      this.router.navigate(["/unauthorized"])
    }
  }

  redirectByRole(): void {
    const userType = this.getUserType()
    if (userType === "Admin") {
      this.router.navigate(["/admin"])
    } else if (userType === "Mozo") {
      this.router.navigate(["/mozo"])
    } else {
      this.router.navigate(["/inicio"])
    }
  }

  getUserRole(): string | null {
    return this.getUserType()
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken()
    if (!token) return null
    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("Invalid token format")
      }
      const payload = parts[1]
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload) as DecodedToken
    } catch (error) {
      return null
    }
  }

  getUserInfo(): UserInfo | null {
    const storedInfo = localStorage.getItem(this.USER_INFO_KEY);
    if (storedInfo) {
      try {
        const parsed = JSON.parse(storedInfo);
        return parsed;
      } catch (e) {
        console.error("Error parsing user info:", e);
      }
    }
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      const userInfo: UserInfo = {
        id: decodedToken.id,
        userType: decodedToken.userType,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
      };
      return userInfo;
    }
    return null;
  }

  getUserName(): string {
    const userInfo = this.getUserInfo();
    if (userInfo) {
      if (userInfo.firstName && userInfo.lastName) {
        return `${userInfo.firstName} ${userInfo.lastName}`;
      }
      if (userInfo.email) {
        return userInfo.email;
      }
    }
    return 'User';
  }

  login(credentialsOrEmail: { email: string; password: string } | string, password?: string): Observable<any> {
    let credentials: { email: string; password: string }
    if (typeof credentialsOrEmail === "string" && password) {
      credentials = { email: credentialsOrEmail, password }
    } else if (typeof credentialsOrEmail === "object") {
      credentials = credentialsOrEmail
    } else {
      return of({ error: "Invalid login arguments" } as any)
    }
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    })
    return this.http.post<any>(`${this.baseUrl}/users/login`, credentials, { headers }).pipe(
      map((response) => {
        return response
      }),
      tap((response) => {
        if (response && response.token) {
          this.setSession(response)
          const userInfo: UserInfo = {
            id: response.id,
            userType: response.userType,
            firstName: response.firstName,
            lastName: response.lastName,
            email: credentials.email,
          }
          localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo))
        } else {
          console.error("Invalid login response format:", response)
        }
      }),
      catchError((error) => {
        console.error("Login error:", error)
        // Aquí no se llama a clearToken/logout porque el interceptor ya lo maneja
        // o porque es un error de credenciales, no de token expirado.
        return of({
          error: true,
          status: error.status,
          message: error.error?.message || "Error en el inicio de sesión",
        })
      }),
    )
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/register`, userData).pipe(
      tap((response) => {
        if (response && response.token) {
          this.setSession(response);
          const userInfo: UserInfo = {
            id: response.id,
            userType: response.userType,
            firstName: response.firstName || userData.firstName,
            lastName: response.lastName || userData.lastName,
            email: userData.email,
          };
          localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
        }
      }),
      catchError((error) => {
        console.error('❌ Register error:', error);
        return of({
          error: true,
          status: error.status,
          message: error.error?.message || "Error en el registro",
          errors: error.error?.errors || []
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_ID_KEY)
    localStorage.removeItem(this.USER_TYPE_KEY)
    localStorage.removeItem(this.EXPIRES_AT_KEY)
    localStorage.removeItem(this.USER_INFO_KEY)
    this.isAuthenticatedSubject.next(false)
    this.router.navigate(["/login"])
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
      if (expiresAt) {
        const isExpired = new Date() > new Date(expiresAt);
        if (isExpired) {
          this.clearToken();
          return null;
        }
      }
    }
    return token;
  }

  getId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  }

  getUserType(): string | null {
    return localStorage.getItem(this.USER_TYPE_KEY)
  }

  isLoggedIn(): boolean {
    return this.hasValidToken()
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.EXPIRES_AT_KEY)
    this.isAuthenticatedSubject.next(false)
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh-token`, {}).pipe(
      tap((response) => this.setSession(response)),
      catchError((error) => {
        this.clearToken()
        return of(error)
      }),
    )
  }

  private setSession(authResult: AuthResponse): void {
    const expiresAt = new Date()
    const expiresInMs = this.parseExpiresIn(authResult.expiresIn || "1h")
    expiresAt.setTime(expiresAt.getTime() + expiresInMs)
    localStorage.setItem(this.TOKEN_KEY, authResult.token)
    localStorage.setItem(this.USER_ID_KEY, authResult.id)
    localStorage.setItem(this.USER_TYPE_KEY, authResult.userType)
    localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toISOString())
    this.isAuthenticatedSubject.next(true)
  }

  private parseExpiresIn(expiresIn: string): number {
    const cleanExpiresIn = expiresIn.trim().toLowerCase();
    const match = cleanExpiresIn.match(/^(\d+)([smhd]?)$/);
    if (!match) {
      console.warn(' Invalid expiresIn format, defaulting to 1 hour');
      return 60 * 60 * 1000; // 1 hour default
    }
    const value = parseInt(match[1]);
    const unit = match[2] || 'h'; // default to hours
    let milliseconds: number;
    switch (unit) {
      case 's': milliseconds = value * 1000; break;
      case 'm': milliseconds = value * 60 * 1000; break;
      case 'h': milliseconds = value * 60 * 60 * 1000; break;
      case 'd': milliseconds = value * 24 * 60 * 60 * 1000; break;
      default: milliseconds = value * 60 * 60 * 1000; // default to hours
    }
    return milliseconds;
  }

  private hasValidToken(): boolean {
    const token = this.getToken()
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY)
    if (!token || !expiresAt) {
      return false
    }
    return new Date() < new Date(expiresAt)
  }


}
