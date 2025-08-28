import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangeTicketStatusRequest, CreateAssignTicketRequest, Ticket, TranslatePriority, TranslateStatus } from '../../models/Ticket';
import { Tickets_Services } from '../../services/ticket-service';
import { HasRole } from '../../directives/has-role';
import { Token } from '../../services/token';
import { Notificacao } from '../../services/notificacao';
import { ApplicationUser } from '../../models/AuthModels';
import { Auth_Services } from '../../services/auth-services';

export interface Anexo {
  file: File;
  preview: string | null;
}

@Component({
  selector: 'app-detalhes-chamado',
  imports: [CommonModule, FormsModule, HasRole],
  templateUrl: './detalhes-chamado.html',
  styleUrl: './detalhes-chamado.css'
})

export class DetalhesChamado {
  id!: string;
  ticket: Ticket | null = null;
  anexos: Anexo[] = [];
  resposta: string = '';
  selectedAnalystId: string | null = null;

  analysts: ApplicationUser [] = [];
  @ViewChild('analystDialog') analystDialog!: ElementRef<HTMLDialogElement>;
  isDialogOpen: boolean = false;

  constructor(private route: ActivatedRoute, private ticketService: Tickets_Services, private tokenServices: Token, private notificacao: Notificacao, private authService: Auth_Services) {
    this.id = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void{
    this.LoadTickets();
    document.addEventListener('click', this.onDialogClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDialogClick.bind(this));
  }

  LoadTickets(){
    this.ticketService.GetTicketById(this.id)
      .subscribe({
        next: (data) => {
          this.ticket = data;
        },
        error: (err) => {
          console.log(err)
        }
      });

  }

  LoadAnalysts(){
    this.authService.GetAnalysts()
      .subscribe({
        next: (data) => {
          this.analysts = data.data;
          this.analystDialog.nativeElement.showModal()
        },
        error: (err) => {
          console.log(err)
        }
      });
  }

  closeDialog() {
    this.analystDialog.nativeElement.close();
  }

  onDialogClick(event: MouseEvent) {
    const dialog = this.analystDialog?.nativeElement;
  if (!dialog || !dialog.open) return;

  const rect = dialog.getBoundingClientRect();
  const clickedInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.bottom &&
    rect.left <= event.clientX &&
    event.clientX <= rect.right;

  if (!clickedInDialog) {
    this.closeDialog();
  }
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.AddAttachments(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files) as File[];
      this.AddAttachments(files);
    }
  }

  AddAttachments(files: File[]) {
    for (let file of files) {
      if (this.anexos.length >= 3) break;

      const anexo: Anexo = { file, preview: null };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          anexo.preview = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      this.anexos.push(anexo);
    }
  }

  newInteraction() {
    if (!this.ticket) return;

    const payload = this.tokenServices.GetPayload();
    if (!payload) return;

    const formData = new FormData();

    formData.append("TicketId", this.ticket.id);
    formData.append("Message", this.resposta);

    for (const anexo of this.anexos) {
      formData.append("Files", anexo.file);
    }

    this.ticketService.CreateTicketInteraction(formData).subscribe({
    next: (response) => {
      if (response.success) {
        this.notificacao.sucesso("Resposta enviada com sucesso!");
        this.resposta = '';
        this.anexos = [];
        this.LoadTickets();
      } else {
          this.notificacao.erro(response.errors);
        }
      },
      error: (err) => {
        this.notificacao.erro(err?.error?.errors || "Erro ao enviar resposta.");
      }
    });
  }

  removerAnexo(index: number) {
  this.anexos.splice(index, 1);
  }

  SelfAssignTicket(){
    const payload = this.tokenServices.GetPayload();

    if(payload){
      const ticketId = String(this.route.snapshot.paramMap.get('id'));

      let request: CreateAssignTicketRequest = {
        TicketId: ticketId,
        AnalystId: payload?.id,
        AnalystEmail: payload?.email
      }

      this.ticketService.AssignTicket(request).subscribe({
        next: (response) => {
          if(response.success){
            this.notificacao.sucesso("Atribuição concluída.");
            this.LoadTickets();
          }

          else{
            console.log(response.errors)
            this.notificacao.erro(response.errors);
          }
        },
        error: (err) => {
          this.notificacao.erro(err?.error?.errors);
        }
      });
    }
  }

  OpenAllAttachments(attachments: string[] | null) {
    if (attachments && attachments.length > 0) {
        attachments.forEach(url => {
        if (url) {
          window.open(url.replace('https', 'http'), '_blank');
          }
        });
      }
      else{
        this.notificacao.info("Esse ticket/interação não possui anexos.");
      }
  }

  ChangeTicketStatus(status: number){

    let request: ChangeTicketStatusRequest = {
      TicketId: this.id,
      Status: status
    };

    this.ticketService.ChangeTicketStatus(request).subscribe({
      next: (response) => {
        if(response.success){
          this.notificacao.sucesso("Ticket Finalizado!");
          this.LoadTickets();
        }

        else{
          console.log(response.errors)
          this.notificacao.erro(response.errors);
        }
      },
      error: (err) => {
        this.notificacao.erro(err?.error?.errors);
      }
    });
  }

  TranslatePriority(): string{
    return TranslatePriority(this.ticket?.priority);
  }

  TranslateStatus(): string{
    return TranslateStatus(this.ticket?.status);
  }

  getPriorityClass(): string {
    const prioridadeTraduzida = TranslatePriority(this.ticket?.priority).toLowerCase();
    return `prioridade ${prioridadeTraduzida}`;
  }

  selectRadio(radio: HTMLInputElement) {
    radio.checked = true;
  }

  AssginAnalist(){
    const dialog = this.analystDialog.nativeElement;
    const selectedRadio = dialog.querySelector<HTMLInputElement>('input[type="radio"]:checked');

    if (!selectedRadio) {
      console.log('Nenhum analista selecionado');
      return;
    }

    const li = selectedRadio.closest('li');
    const label = li?.querySelector('label');
    const email = label?.textContent?.trim() || '';

    const ticketId = String(this.route.snapshot.paramMap.get('id'));

      let request: CreateAssignTicketRequest = {
        TicketId: ticketId,
        AnalystId: selectedRadio.value,
        AnalystEmail: email
      }

    this.ticketService.AssignTicket(request).subscribe({
        next: (response) => {
          if(response.success){
            this.notificacao.sucesso("Atribuição concluída.");
            this.LoadTickets();
            this.closeDialog();
          }

          else{
            console.log(response.errors)
            this.notificacao.erro(response.errors);
          }
        },
        error: (err) => {
          this.notificacao.erro(err?.error?.errors);
        }
      });
  }
}
