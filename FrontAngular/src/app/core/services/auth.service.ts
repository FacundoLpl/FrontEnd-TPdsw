import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:3000/api/users/login';
  private REGISTER_URL = 'http://localhost:3000/api/users/'; // Ajustá según tu backend
  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient, private router: Router) {}

  // Función para login
  login(user: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL, { email: user, password }).pipe(
      tap(response => {
        if (response.token) {
          console.log('Token received:', response.token);
          this.setToken(response.token);
        }
      }),
      catchError(err => {
        console.error('Login failed:', err);
        throw err; // Lanza el error para capturarlo en el componente
      })
    );
  }

  // Función para el registro
  register(userData: any): Observable<any> {
    return this.httpClient.post<any>(this.REGISTER_URL, userData).pipe(
      tap(response => {
        if (response.token) {
          console.log('Registered and token received:', response.token);
          this.setToken(response.token);
        }
      }),
      catchError(err => {
        console.error('Registration failed:', err);
        throw err; // Lanza el error para capturarlo en el componente
      })
    );
  }

  // Guardar token en el localStorage
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Obtener el token del localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Obtener el token decodificado
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Obtener ID del usuario
  getId(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.id || null;
  }

  // Obtener tipo de usuario desde el token
  getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.role || null;
  }

  // Verificar si el token está presente y no ha expirado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.getDecodedToken();
    if (!decodedToken?.exp) return false;

    return decodedToken.exp * 1000 > Date.now();
  }

  // Verificar si el usuario es Admin
  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.getDecodedToken();
    if (!decodedToken?.exp) return false;

    if (decodedToken.exp * 1000 < Date.now()) return false;

    return decodedToken.userType === 'Admin';
  }

  // Log out y redirigir al login
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    // Limpiar cualquier otra información de sesión si es necesario
    this.router.navigate(['/login']);
  }

  // Redirigir si el usuario no es Admin
  redirectIfNotAdmin(): void {
    if (!this.isAdmin()) {
      this.router.navigate(['/error']); // Redirige a una página de error o página no autorizada
    }
  }
}
