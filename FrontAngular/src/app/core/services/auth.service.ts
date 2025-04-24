import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = 'http://localhost:3000/api/users/login';
  private tokenKey = 'authToken';
  private currentUserId = 'userId';

  constructor(private httpClient: HttpClient, private router: Router ) { }

  login(user: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL , { email: user, password }).pipe(
      tap(response => {
        if (response.token) {
          console.log('Token received:', response.token);
          this.setToken(response.token)
          this.setId(response.id)
          }
      }) 
    )
  }

  private setToken(token: string): void { 
  localStorage.setItem(this.tokenKey, token);
}
private setId(id: string): void { 
  localStorage.setItem(this.currentUserId, id);
}

getToken(): string | null {
    if (typeof window !== 'undefined') {
    return localStorage.getItem(this.tokenKey);
  }else return null;
}

getId(): string | null {
  if (typeof window !== 'undefined') {
  return localStorage.getItem(this.currentUserId);
}else return null;
}

  //validar que el token existe y que no haya expirado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    //recupero el payload del token y valido la fecha de expiracion
    // El token JWT tiene tres partes: header, payload y signature, separadas por puntos.
    // La segunda parte (payload) contiene la información del token, incluyendo la fecha de expiración (exp).
    const payload = JSON.parse(atob(token.split('.')[1]));
    // con atob decodifico el payload, que es un string en base64
    // y lo convierto a un objeto JSON.
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate > new Date();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUserId);
    this.router.navigate(['/login']);
  } // redirijo a la pagina de login
  // Eliminar el token del localStorage y redirigir a la página de inicio de sesión.
}