import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError, throwError } from "rxjs"
import { AuthService } from "../../core/services/auth.service"
import { Router } from "@angular/router"

// En tu interceptor, añade más debugging:
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  console.log('🚀 INTERCEPTOR - Processing URL:', req.url);

  // Skip adding token for login and register requests
  if (isAuthEndpoint(req.url)) {
    console.log('✅ SKIPPING token for auth endpoint:', req.url);
    return next(req)
  }

  // Get the auth token
  const token = authService.getToken()
  console.log('🔑 INTERCEPTOR - Token exists:', !!token);

  // Clone the request and add the token if it exists
  if (token) {
    console.log('📤 INTERCEPTOR - ADDING token to:', req.url);
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Verificar que el header se añadió
    console.log('🔍 INTERCEPTOR - Authorization header added:', clonedReq.headers.get('Authorization') ? 'YES' : 'NO');
    
    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('❌ INTERCEPTOR - Error for URL:', req.url, error);
        // resto del manejo de errores...
        return throwError(() => error)
      }),
    )
  } else {
    console.log('🚫 INTERCEPTOR - NO TOKEN for:', req.url);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // manejo de errores...
      return throwError(() => error)
    }),
  )
}

function isAuthEndpoint(url: string): boolean {
  const isAuth = url.includes("/api/users/login") || url.includes("/api/users/register");
  console.log(`🔍 INTERCEPTOR - isAuthEndpoint("${url}") = ${isAuth}`);
  return isAuth;
}