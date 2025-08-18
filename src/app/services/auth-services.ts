import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';
import { ApiResponse, TokenPayload } from '../models/Response';
import { jwtDecode } from 'jwt-decode';
import { API_CONFIG } from '../core/API_CONFIG';

@Injectable({
  providedIn: 'root'
})
export class Auth_Services {

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<LoginResponse>{
    return this.http.post<ApiResponse<LoginResponse>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/login`, {
      email,
      password
    }).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        } else {
          throw response.errors.join(', ');
        }
      }),
      catchError(err => {
         const backendErrors = err.error?.errors;
        if (backendErrors && Array.isArray(backendErrors)) {
          return throwError(() => (backendErrors));
        }

        return throwError(() => ['Erro inesperado ao fazer login']);
        })
    );
  }

   AddStorage(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  logout() {
    sessionStorage.clear()
    this.router.navigate(['/']);
  }

  isAutenticado(): boolean {
    return !!sessionStorage.getItem('auth_token');
  }

  GetStorageItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  IsAuthorize(roles: string[]): boolean{
    const token = sessionStorage.getItem('token');
    if(!token) return false


    const decoded = jwtDecode<TokenPayload>(token);
    return roles.some(x => decoded.roles.includes(x));
  }
}
