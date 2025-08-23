import { Component } from '@angular/core';
import { TicketDashboardResponse } from '../../models/Ticket';
import { Tickets_Services } from '../../services/ticket-service';
import { Notificacao } from '../../services/notificacao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent {
  email: string | null = sessionStorage.getItem("email");
  TicketDashboardResponse: TicketDashboardResponse | null = null

  constructor(private ticket_services: Tickets_Services, private notificacao: Notificacao){

  }

  ngOnInit(){
    this.ticket_services.GetTicketAnalysis()
    .subscribe({
      next: (response) => {
        this.TicketDashboardResponse = response.data
      },
      error: (err) => {
        this.notificacao.erro(err);
      }
    });
  }
}
