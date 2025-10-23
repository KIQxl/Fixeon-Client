import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/Response';
import { Observable } from 'rxjs';
import { CreateCategory, CreateDepartament, CreateSla, Organization } from '../models/AuthModels';
import { API_CONFIG } from '../core/API_CONFIG';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Organization_services {

  constructor(private http: HttpClient, private router: Router) { }

   GetAllOrganizations(): Observable<ApiResponse<Organization []>>{
      return this.http.get<ApiResponse<Organization []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ORGANIZATIONS}`);
    }

    GetOrganizationById(orgId: string): Observable<ApiResponse<Organization>>{
      return this.http.get<ApiResponse<Organization>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ORGANIZATIONS}/${orgId}`);
    }

    CreateCategory(request: CreateCategory): Observable<ApiResponse<boolean>>{
      return this.http.post<ApiResponse<boolean>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ORGANIZATIONS}/create-category`, request);
    }

    CreateDepartament(request: CreateDepartament): Observable<ApiResponse<boolean>>{
      return this.http.post<ApiResponse<boolean>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ORGANIZATIONS}/create-departament`, request);
    }

    CreateSLA(request: CreateSla): Observable<ApiResponse<boolean>>{
      return this.http.post<ApiResponse<boolean>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ORGANIZATIONS}/create-sla`, request);
    }
}
