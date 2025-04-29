import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
 const authService = inject(AuthService);
   const router = inject(Router);

  if(authService.isAdmin ()) {
    return true; // Si el usuario está autenticado, permite el acceso a la ruta
  }else {
    router.navigate(['/']); // Si no está autenticado, redirige a la página de inicio de sesión
    return false; // Bloquea el acceso a la ruta
  }

};
