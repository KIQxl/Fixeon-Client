import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/Response';
import { Company, CreateTagRequest } from '../models/CompanyModels';
import { API_CONFIG } from '../core/API_CONFIG';
import { Tag } from '../models/Ticket';

@Injectable({
  providedIn: 'root'
})
export class CompanyServices {

  constructor(private http: HttpClient) { }

  // GetAllCompanies(): Observable<ApiResponse<Company []>>{
  //   return this.http.get<ApiResponse<Company []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.COMPANIES}`);
  // }

  GetAllTags(): Observable<ApiResponse<Tag []>>{
    return this.http.get<ApiResponse<Tag []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.COMPANIES}/get-tags`);
  }

  CreateTag(request: CreateTagRequest): Observable<ApiResponse<boolean>>{
    return this.http.post<ApiResponse<boolean>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.COMPANIES}/create-tag`, request);
  }

  RemoveTag(id: string): Observable<ApiResponse<Company []>>{
    return this.http.delete<ApiResponse<Company []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.COMPANIES}/remove-tag/${id}`);
  }
}
