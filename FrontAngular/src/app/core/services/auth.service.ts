import { Injectable } from "@angular/core"
import {  HttpClient, HttpHeaders } from "@angular/common/http"
import { BehaviorSubject,  Observable, of } from "rxjs"
import { tap, catchError, map } from "rxjs/operators"
import  { Router } from "@angular/router"

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

  // Update the base URL to match your actual API endpoint
  private baseUrl = "http://localhost:3000/api"

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  console.log('🔧 AuthService keys:', {
    TOKEN_KEY: this.TOKEN_KEY,
    USER_ID_KEY: this.USER_ID_KEY,
    USER_TYPE_KEY: this.USER_TYPE_KEY,
    EXPIRES_AT_KEY: this.EXPIRES_AT_KEY
  });
}

  // Method to check if user is authenticated (for template usage)
  isAuthenticated(): boolean {
  const token = this.getToken();
  const isAuth = !!token;
  console.log('🔍 isAuthenticated check:', { token: !!token, result: isAuth });
  return isAuth;
}

  // Method to check if user is admin
  isAdmin(): boolean {
    const userType = this.getUserType()
    return userType === "Admin"
  }

  // Method to check if user is mozo
  isMozo(): boolean {
    const userType = this.getUserType()
    return userType === "Mozo"
  }

  // Method to redirect if not admin
  redirectIfNotAdmin(): void {
    if (!this.isAdmin()) {
      this.router.navigate(["/unauthorized"])
    }
  }

  // Method to redirect based on user role
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

  // Method to get user role
  getUserRole(): string | null {
    return this.getUserType()
  }

  // Method to decode JWT token without external library
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken()
    if (!token) return null

    try {
      // JWT token consists of three parts: header.payload.signature
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("Invalid token format")
      }

      // Decode the payload (second part)
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
      console.error("Error decoding token:", error)
      return null
    }
  }

  // Method to get user info
  getUserInfo(): UserInfo | null {
    const storedInfo = localStorage.getItem(this.USER_INFO_KEY)
    if (storedInfo) {
      try {
        return JSON.parse(storedInfo)
      } catch (e) {
        console.error("Error parsing user info:", e)
      }
    }

    // If no stored info, return basic info from token
    const decodedToken = this.getDecodedToken()
    if (decodedToken) {
      // Create a basic user info object from token data
      const userInfo: UserInfo = {
        id: decodedToken.id,
        userType: decodedToken.userType,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
      }

      // Store this info for future use
      localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo))
      return userInfo
    }

    return null
  }

  // Updated login method to use the correct endpoint and handle different input formats
  login(credentialsOrEmail: { email: string; password: string } | string, password?: string): Observable<any> {
    let credentials: { email: string; password: string }

    if (typeof credentialsOrEmail === "string" && password) {
      // If called with separate email and password
      credentials = { email: credentialsOrEmail, password }
    } else if (typeof credentialsOrEmail === "object") {
      // If called with credentials object
      credentials = credentialsOrEmail
    } else {
      // Invalid arguments
      return of({ error: "Invalid login arguments" } as any)
    }

    console.log("Login request with:", { email: credentials.email, password: "***" })

    // Set headers for the request
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    })

    // Use the correct login endpoint
    return this.http.post<any>(`${this.baseUrl}/users/login`, credentials, { headers }).pipe(
      map((response) => {
        console.log("Raw login response:", response)
        return response
      }),
      tap((response) => {
        console.log("Processing login response:", response)

        // Check if response has the expected structure
        if (response && response.token) {
          this.setSession(response)

          // Store additional user info if available
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

        // Clear any existing token if we get an auth error
        if (error.status === 401) {
          this.clearToken()
        }

        return of({
          error: true,
          status: error.status,
          message: error.error?.message || "Error en el inicio de sesión",
        })
      }),
    )
  }

  // En tu AuthService, añade este método:
register(userData: any): Observable<any> {
  console.log('🔄 AuthService register called with:', userData);
  
  return this.http.post<any>(`${this.baseUrl}/users/register`, userData).pipe(
    tap((response) => {
      console.log('📥 Register response received:', response);
      
      if (response && response.token) {
        console.log('💾 Storing token from registration');
        this.setSession(response);
        
        // Store additional user info
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
  console.log('🔑 getToken called with key:', this.TOKEN_KEY);
  const token = localStorage.getItem(this.TOKEN_KEY);
  console.log('🔍 getToken result:', token ? 'TOKEN_EXISTS' : 'NO_TOKEN');
  
  if (token) {
    // Verificar expiración
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    if (expiresAt) {
      const isExpired = new Date() > new Date(expiresAt);
      console.log('⏰ Token expired check:', isExpired);
      if (isExpired) {
        console.log('🗑️ Token expired, clearing...');
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
    console.log('👤 User ID from token:', payload.id);
    return payload.id;
  } catch (e) {
    console.log('❌ Error getting ID from token');
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
    console.log('✅ Tokens cleared');
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
  console.log('🔄 setSession called with:', authResult);
  console.log('🔑 TOKEN_KEY constant:', this.TOKEN_KEY);
  
  const expiresAt = new Date()
  // Parse expiresIn (e.g., "1h" to milliseconds)
  const expiresInMs = this.parseExpiresIn(authResult.expiresIn || "1h")
  console.log('⏰ Parsed expiresIn:', expiresInMs, 'ms');
  
  expiresAt.setTime(expiresAt.getTime() + expiresInMs)
  console.log('📅 Token expires at:', expiresAt.toISOString());

  console.log('💾 Storing token with key:', this.TOKEN_KEY);
  localStorage.setItem(this.TOKEN_KEY, authResult.token)
  localStorage.setItem(this.USER_ID_KEY, authResult.id)
  localStorage.setItem(this.USER_TYPE_KEY, authResult.userType)
  localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toISOString())

  // Verificar inmediatamente que se guardó
  const storedToken = localStorage.getItem(this.TOKEN_KEY);
  console.log('✅ Token stored successfully:', !!storedToken);
  console.log('🔍 Stored token preview:', storedToken?.substring(0, 20) + '...');

  this.isAuthenticatedSubject.next(true)
  console.log('📡 isAuthenticatedSubject updated to true');
}

  private parseExpiresIn(expiresIn: string): number {
  console.log('⏰ Parsing expiresIn:', expiresIn);
  
  // Remove any whitespace
  const cleanExpiresIn = expiresIn.trim().toLowerCase();
  
  // Extract number and unit
  const match = cleanExpiresIn.match(/^(\d+)([smhd]?)$/);
  
  if (!match) {
    console.warn('⚠️ Invalid expiresIn format, defaulting to 1 hour');
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
  
  console.log('✅ Parsed result:', { value, unit, milliseconds });
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

  private checkTokenValidity(): void {
    if (this.hasValidToken()) {
      this.isAuthenticatedSubject.next(true)
    } else {
      this.clearToken()
    }
  }
}
