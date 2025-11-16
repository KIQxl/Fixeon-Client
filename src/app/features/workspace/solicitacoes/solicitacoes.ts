import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SLA, Ticket, TranslatePriority, TranslateStatus } from '../../../core/models/Ticket';
import { Tickets_Services } from '../../../core/services/ticket-service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-solicitacoes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './solicitacoes.html',
  styleUrl: './solicitacoes.css'
})
export class Solicitacoes {
  
  tickets!: Ticket[];
  filteredTickets!: Ticket[];

  visualizationPreference: boolean = JSON.parse(localStorage.getItem("visualizationPreference") || "false");

  isCardView: boolean = this.visualizationPreference;


  constructor (private ticket_service: Tickets_Services, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void{
    this.ticket_service.GetTickets(null, null, null, null, null, null).subscribe({
      next: (res) => {
        this.tickets = res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.filteredTickets = this.tickets;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  TranslatePriority(prioridade: string): string{
    return TranslatePriority(prioridade);
  }
  
  GetPriorityClass(prioridade: string): string {
    const prioridadeTraduzida = this.TranslatePriority(prioridade).toLowerCase();
    return `prioridade ${prioridadeTraduzida}`;
  }

  TranslateStatus(status: string): string{
      return TranslateStatus(status);
  }

  GetStatusClass(status: string): string {
    const translatedStatus = this.TranslateStatus(status);
    return `${translatedStatus.toLowerCase().replace(/ /g, '-')}`;
  }

  toggleView(): void {
    this.isCardView = !this.isCardView;
    localStorage.setItem("visualizationPreference", this.isCardView.toString());
  }

  goToTicketDetails(ticketId: string): void {
    this.router.navigate(['/solicitacoes', ticketId]);
  }

  searchText: string = '';

  onSearchChange() {
    if (this.searchText !== '') {
      const search = this.searchText.toLowerCase();
      const filteredMap = new Map<string, any>();

      this.tickets.forEach(ticket => {
        if (
          ticket.protocol.toLowerCase().includes(search) ||
          ticket.title.toLowerCase().includes(search) ||
          ticket.customer.userEmail.toLowerCase().includes(search)
        ) {
          filteredMap.set(ticket.protocol, ticket); // evita duplicatas
        }
      });

      this.filteredTickets = Array.from(filteredMap.values());
    }
    else
      this.filteredTickets = this.tickets;
  }

  ValidaSLA(prazo: SLA | null): SafeHtml {
    const dataAtual = new Date();

    if (!prazo?.deadline) {
      return this.sanitizer.bypassSecurityTrustHtml('-');
    }

    let accomplished = prazo.accomplished;
    let deadline = new Date(prazo.deadline);

    if(accomplished){
      if(new Date(accomplished) > deadline)
        return this.sanitizer.bypassSecurityTrustHtml(`<i class="fa-solid fa-xmark" style="color: #ef4444;"></i>`);
      else
         return this.sanitizer.bypassSecurityTrustHtml(`<i class="fa-solid fa-check" style="color: #10b981;"></i>`);
    }
    else{
      if (dataAtual > deadline) {
        return this.sanitizer.bypassSecurityTrustHtml(
          `<i class="fa-solid fa-xmark" style="color: #ef4444;"></i>`
        );
      } else {
        return this.sanitizer.bypassSecurityTrustHtml(
          `<i class="fa-solid fa-check" style="color: #10b981;"></i>`
        );
      }
    }
  }

  trackByUserId(index: number, user: any) {
  return user.id;
}
}

