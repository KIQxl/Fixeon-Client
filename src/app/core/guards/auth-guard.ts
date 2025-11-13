import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth_Services } from '../services/auth-services';
import { Notificacao } from '../services/notificacao';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(Auth_Services);
  const router = inject(Router);
  const notification = inject(Notificacao);

  if(!authService.isLoggedIn()){
    router.navigate(['/auth/login']);
    notification.erro("Acesso negado: Usuário não está autenticado.");
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRoles = authService.getUserRoles();
  const hasPermission = userRoles.some(role => requiredRoles.includes(role));

  if (hasPermission) {
    return true;
  } else {
    notification.erro(`Acesso Negado: Você não tem permissão para acessar essa tela.`);
    router.navigate(['/dashboard']);
    return false;
  }
};
