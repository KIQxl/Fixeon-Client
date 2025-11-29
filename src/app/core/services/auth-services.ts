import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';
import { ApiResponse, TokenPayload } from '../models/Response';
import { jwtDecode } from 'jwt-decode';
import { API_CONFIG } from '../API_CONFIG';
import { ApplicationUser, AssociateRoleRequest, CreateAccountRequest, Organization, UpdateApplicationUser } from '../models/AuthModels';

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
          this.AddStorage("token", response.data.token);
          this.AddStorage("id", response.data.id);
          this.AddStorage("email", response.data.email);
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

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
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

  getUserRoles(): string[] {
    const token = sessionStorage.getItem('token');

    if (!token) {
      return [];
  }
    
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.roles || [];
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return [];
    }
  }

  GetAnalysts(): Observable<ApiResponse<ApplicationUser []>>{
    return this.http.get<ApiResponse<ApplicationUser []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/analysts`);
  }

  GetAllUsers(id: string | null, email: string | null, organizationId: string | null, username: string | null): Observable<ApiResponse<ApplicationUser []>>{

    var params = new HttpParams();

    if (id) params = params.set('id', id);
    if (email) params = params.set('email', email);
    if (organizationId) params = params.set('organization', organizationId);
    if (username) params = params.set('username', username);

    return this.http.get<ApiResponse<ApplicationUser []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/get-all-users`, { params });
  }

  GetAllRoles(): Observable<ApiResponse<string []>>{
    return this.http.get<ApiResponse<string []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/get-all-roles`);
  }

  UpdateApplicationUser(request: UpdateApplicationUser): Observable<ApiResponse<ApplicationUser>>{
    return this.http.put<ApiResponse<ApplicationUser>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/update-account`, request);
  }

  AssociateRoles(request: AssociateRoleRequest): Observable<ApiResponse<ApplicationUser>>{
    return this.http.post<ApiResponse<ApplicationUser>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/associate-role`, request);
  }

  CreeateAccount(request: FormData): Observable<ApiResponse<ApplicationUser>>{
    return this.http.post<ApiResponse<ApplicationUser>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/create-account`, request);
  }

  GetUserById(id: string): Observable<ApiResponse<ApplicationUser>>{
    return this.http.get<ApiResponse<ApplicationUser>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/get-user-by-id/${id}`);
  }

  CreeateAccountAdmin(request: FormData): Observable<ApiResponse<ApplicationUser>>{
    return this.http.post<ApiResponse<ApplicationUser>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.AUTH}/create-account-master`, request);
  }
}
