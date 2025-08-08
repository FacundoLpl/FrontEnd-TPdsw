import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError, throwError } from "rxjs"
import { AuthService } from "../../core/services/auth.service" // Asegúrate de que la ruta sea correcta
import { Router } from "@angular/router"

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (isPublicEndpoint(req.url, req.method)) {
    console.log(`INTERCEPTOR - PUBLIC ENDPOINT: ${req.method} ${req.url}`);
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(`Public endpoint error (${error.status}): ${req.method} ${req.url}`);
        return throwError(() => error)
      }),
    )
  }
  const token = authService.getToken()
  if (token) {
    console.log(`INTERCEPTOR - ADDING TOKEN for PRIVATE endpoint: ${req.method} ${req.url}`);
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
          console.log('INTERCEPTOR - 401 ERROR on PRIVATE endpoint, logging out');
          authService.logout();
        }
        return throwError(() => error)
      }),
    )
  } else {
   
    console.log('INTERCEPTOR - NO TOKEN for PRIVATE endpoint, redirecting to login:', req.url);
    router.navigate(['/login']);
    return throwError(() => new Error('No authentication token available for private endpoint'))
  }
}


function isPublicEndpoint(url: string, method: string): boolean {
  const publicEndpoints = [

    { pattern: "/api/users/login", methods: ["POST"] },
    { pattern: "/api/users/register", methods: ["POST"] },
 
    { pattern: "/api/reviews", methods: ["GET"] },

    { pattern: "/api/reviews/product/", methods: ["GET"] }, 
    
    // Rutas de productos (GET es público)
    { pattern: "/api/products", methods: ["GET"] },
    
 
    { pattern: "/api/categories", methods: ["GET"] },

  ];

  const isPublic = publicEndpoints.some(endpoint => {
    const urlMatches = url.includes(endpoint.pattern);
    const methodMatches = endpoint.methods.includes(method.toUpperCase());
    return urlMatches && methodMatches;
  });

  return isPublic;
}
