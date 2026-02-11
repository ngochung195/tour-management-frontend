import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data?.['role'];
  const role = authService.getRole();

  if (!authService.isLoggedIn() || !role) {
    authService.logout();
    return router.createUrlTree(['/login']);
  }

  if (expectedRole && role !== expectedRole) {
    return router.createUrlTree(['/403']);
  }

  return true;
};
