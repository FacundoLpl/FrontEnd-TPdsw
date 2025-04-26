import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 1. Obtener el token
    const token = localStorage.getItem('token');
    
    // 2. Verificar si la request necesita token
    if (!token || this.shouldSkipToken(req)) {
      return next.handle(req);
    }

    // 3. Clonar la request con el token
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // 4. Continuar con la request modificada
    return next.handle(tokenizedReq);
  }

  /**
   * Determina si la request no requiere token
   */
  private shouldSkipToken(req: HttpRequest<any>): boolean {
    // Lista de endpoints públicos que no requieren token
    const publicUrls = ['/auth/login', '/auth/register'];
    
    // Verificar si la URL está en la lista de públicas
    return publicUrls.some(url => req.url.includes(url));
  }
}