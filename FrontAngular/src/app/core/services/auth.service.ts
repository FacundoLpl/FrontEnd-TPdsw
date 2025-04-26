import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:3000/api/users/login';
  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient, private router: Router ) { }

  login(user: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL , { email: user, password }).pipe(
      tap(response => {
        if (response.token) {
          console.log('Token received:', response.token);
          this.setToken(response.token)
          }
      }) 
    )
  }

  private setToken(token: string): void { 
  localStorage.setItem(this.tokenKey, token);
}

getToken(): string | null {
    if (typeof window !== 'undefined') {
    return localStorage.getItem(this.tokenKey);
  }else return null;
}

  // Nuevo método para obtener datos del token decodificado
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

    // Obtener ID del usuario desde el token
    getId(): string | null {
      const decodedToken = this.getDecodedToken();
      return decodedToken?.id || null;
    }
  
    // Obtener tipo de usuario desde el token
    getUserRole(): string | null {
      const decodedToken = this.getDecodedToken();
      return decodedToken?.role || null;
    }
  

    isAuthenticated(): boolean {
      const token = this.getToken();
      if (!token) return false;
  
      const decodedToken = this.getDecodedToken();
      if (!decodedToken?.exp) return false;
  
      return decodedToken.exp * 1000 > Date.now();
    }
  
    logout(): void {
      localStorage.removeItem(this.tokenKey);
      this.router.navigate(['/login']);
    }
  }