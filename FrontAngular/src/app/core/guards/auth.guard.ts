import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service.js';  
import { Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated ()) {
    return true; // Si el usuario está autenticado, permite el acceso a la ruta
  }else {
    router.navigate(['/login']); // Si no está autenticado, redirige a la página de inicio de sesión
    return false; // Bloquea el acceso a la ruta
  }
};
