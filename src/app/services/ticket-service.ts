import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, pipe } from 'rxjs';
import { AddTagInTicketRequest, ChangeTicketCategoryAndDepartament, ChangeTicketStatusRequest, CreateAssignTicketRequest, Ticket, TicketDashboardResponse } from '../models/Ticket';
import { ApiResponse } from '../models/Response';
import { API_CONFIG } from '../core/API_CONFIG';

@Injectable({
  providedIn: 'root'
})
export class Tickets_Services {

  constructor(private http: HttpClient) { }
  
  GetTickets() : Observable<Ticket[]>{
    return this.http.get<ApiResponse<Ticket[]>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}`)
    .pipe(
      map(response => {
        if(response.success)
          return response.data
        else{
          throw response.errors
        }
      }),
      catchError(err => {
        throw err
      })
    )
  } 

  GetTicketById(id: string) : Observable<Ticket>{
    return this.http.get<ApiResponse<Ticket>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/${encodeURIComponent(id)}`)
    .pipe(
      map(response => {
        if(response.success)
          return response.data
        else{
          throw response.errors
        }
      }),
      catchError(err => {
        throw err
      })
    )
  }

  CreateTicket(formData: FormData): Observable<ApiResponse<Ticket>>{
    return this.http.post<ApiResponse<Ticket>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/create-ticket`, formData);
  }

  AssignTicket(CreateAssignTicketRequest: CreateAssignTicketRequest): Observable<ApiResponse<Ticket>>{
    return this.http.put<ApiResponse<Ticket>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/assign-ticket`, CreateAssignTicketRequest);
  }

  CreateTicketInteraction(formData: FormData): Observable<ApiResponse<Ticket>>{
    return this.http.post<ApiResponse<Ticket>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/create-interaction`, formData);
  }

  ChangeTicketStatus(request: ChangeTicketStatusRequest): Observable<ApiResponse<Ticket>>{
    return this.http.put<ApiResponse<Ticket>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/change-ticket-status`, request);
  }

  GetCategories(orgId: string): Observable<ApiResponse<string []>>{
    return this.http.get<ApiResponse<string []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.ORGANIZATIONS}/categories/${orgId}`);
  }

  GetTicketAnalysis(): Observable<ApiResponse<TicketDashboardResponse>>{
    return this.http.get<ApiResponse<TicketDashboardResponse>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/get-tickets/analysis`);
  }

  GetPendingTickets(): Observable<ApiResponse<Ticket []>>{
    return this.http.get<ApiResponse<Ticket []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/pending`);
  }

  UpdateTicket(request: ChangeTicketCategoryAndDepartament): Observable<ApiResponse<Ticket []>>{
    return this.http.put<ApiResponse<Ticket []>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/change-ticket-category`, request);
  }

  ManageTagInTicket(request: AddTagInTicketRequest): Observable<ApiResponse<boolean>>{
    return this.http.post<ApiResponse<boolean>>(`${API_CONFIG.BASE_URL}/${API_CONFIG.TICKETS}/add-tag`, request);
  }
}
