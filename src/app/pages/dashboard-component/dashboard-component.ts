import { Component } from '@angular/core';
import { Ticket, TicketDashboardResponse, TranslatePriority, TranslateStatus } from '../../models/Ticket';
import { Tickets_Services } from '../../services/ticket-service';
import { Notificacao } from '../../services/notificacao';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent {
  email: string | null = sessionStorage.getItem("email");
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = []; // Armazena os tickets filtrados para exibição

  activeTab: 'meus' | 'pendentes' | 'andamento' | 'porAnalista' = 'meus';

  constructor(private ticket_services: Tickets_Services, private notificacao: Notificacao, private router: Router){

  }

  ngOnInit(){
    this.GetPendingAndInProgressTickets();
    
    setTimeout(() => {
      this.setActiveTab("meus");
    }, 1000)
  }

  GetPendingAndInProgressTickets(){
    this.ticket_services.GetPendingTickets()
    .subscribe({
      next: (response) => {
        this.tickets = response.data;
      },
      error: (err) => {
        this.notificacao.erro(err);
      }
    })
  }

  setActiveTab(tab: 'meus' | 'pendentes' | 'andamento' | 'porAnalista'): void {
    this.activeTab = tab;
    this.filterTickets();
  }

  filterTickets(): void {
    switch (this.activeTab) {
      case 'meus':
        this.filteredTickets = this.tickets.filter(ticket => ticket.analyst.analystEmail === this.email);
        break;
      case 'pendentes':
        this.filteredTickets = this.tickets.filter(ticket => ticket.status === 'Pending');
        break;
      case 'andamento':
        this.filteredTickets = this.tickets.filter(ticket => ticket.status === 'InProgress');
        break;
      case 'porAnalista':
        // Esta aba pode exigir uma lógica mais complexa, talvez agrupando por analista
        // Por enquanto, vamos mostrar todos os tickets ou uma subseleção.
        // Você pode querer adicionar um dropdown para selecionar o analista aqui.
        this.filteredTickets = this.tickets;
        break;
      default:
        this.filteredTickets = this.tickets; // Default para todos os tickets
        break;
    }
  }

  getTabCount(tab: 'meus' | 'pendentes' | 'andamento' | 'porAnalista'): number {
    switch (tab) {
      case 'meus':
        return this.tickets.filter(ticket => ticket.analyst.analystEmail === this.email).length;
      case 'pendentes':
        return this.tickets.filter(ticket => ticket.status === 'Pending').length;
      case 'andamento':
        return this.tickets.filter(ticket => ticket.status === 'InProgress').length;
      case 'porAnalista':
        return this.tickets.length; // Ou uma contagem mais específica se houver agrupamento
      default:
        return 0;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      // case 'Aberto': return 'status-aberto';
      case 'Pending': return 'status-pendente';
      case 'InProgress': return 'status-em-andamento';
      case 'Resolved': return 'status-resolvido';
      case 'Canceled': return 'status-fechado';
      default: return '';
    }
  }

  getPriorityClass(prioridade: string): string {
    switch (prioridade) {
      case 'High': return 'priority-alta';
      case 'Medium': return 'priority-media';
      case 'Low': return 'priority-baixa';
      default: return '';
    }
  }

  goToTicketDetails(ticketId: string): void {
    this.router.navigate(['/solicitacoes', ticketId]);
  }

  TranslatePriority(prioridade: string): string{
      return TranslatePriority(prioridade);
  }

    TranslateStatus(status: string): string{
        return TranslateStatus(status);
    }
}
