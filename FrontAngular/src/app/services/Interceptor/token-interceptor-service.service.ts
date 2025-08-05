import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError, throwError } from "rxjs"
import { AuthService } from "../../core/services/auth.service"
import { Router } from "@angular/router"

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  if (isAuthEndpoint(req.url)) {
    return next(req)
  }
  const token = authService.getToken()
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      }),
    )
  } else {
    console.log('INTERCEPTOR - NO TOKEN for:', req.url);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      return throwError(() => error)
    }),
  )
}

function isAuthEndpoint(url: string): boolean {
  const isAuth = url.includes("/api/users/login") || url.includes("/api/users/register");
  return isAuth;
}