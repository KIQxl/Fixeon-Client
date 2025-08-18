import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Ticket, TranslatePriority, TranslateStatus } from '../../models/Ticket';
import { Tickets_Services } from '../../services/ticket-service';
import { HasRole } from '../../directives/has-role';

@Component({
  selector: 'app-solicitacoes',
  imports: [CommonModule, RouterModule, HasRole],
  templateUrl: './solicitacoes.html',
  styleUrl: './solicitacoes.css'
})
export class Solicitacoes {
  
  tickets: Ticket[] = [];

  constructor (private ticket_service: Tickets_Services) {}

  ngOnInit(): void{
    this.ticket_service.GetTickets().subscribe({
      next: (data) => {
        this.tickets = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    const prioridadeTraduzida = TranslatePriority(prioridade).toLowerCase();
    return `prioridade ${prioridadeTraduzida}`;
  }

  TranslateStatus(status: string): string{
      return TranslateStatus(status);
    }
}

