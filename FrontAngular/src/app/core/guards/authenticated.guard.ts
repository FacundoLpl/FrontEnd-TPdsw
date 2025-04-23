import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service.js';
import { Router } from '@angular/router';

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated ()) {
    return router.navigate(["/''"]); // Si está autenticado, permite el acceso a la ruta
  }else {
    return true; // Si no está autenticado, redirige a la página de inicio de sesión 
  }
};
