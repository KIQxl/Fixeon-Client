import { HttpInterceptorFn } from '@angular/common/http';
import { Auth_Services } from '../services/auth-services';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Notificacao } from '../services/notificacao';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth_Services);
  const notification = inject(Notificacao);

  const token = auth.GetStorageItem("token");
  const authReq = token ? req.clone({ setHeaders: { Authorization : `Bearer ${token}`}}) : req;

  return next(authReq).pipe(
    catchError(err => {
      if(err.status === 401){
        notification.alerta("Seu token foi expirado. Você não tem permissão para acessar essa página.")
        auth.logout();
      }

      return throwError(() => err);
    })
  );
};
