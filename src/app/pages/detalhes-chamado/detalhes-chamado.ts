import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddTagInTicketRequest, Category, ChangeTicketCategoryAndDepartament, ChangeTicketStatusRequest, CreateAssignTicketRequest, Departament, Tag, Ticket, TranslatePriority, TranslateStatus } from '../../models/Ticket';
import { Tickets_Services } from '../../services/ticket-service';
import { HasRole } from '../../directives/has-role';
import { Token } from '../../services/token';
import { Notificacao } from '../../services/notificacao';
import { ApplicationUser } from '../../models/AuthModels';
import { Auth_Services } from '../../services/auth-services';
import { Organization_services } from '../../services/organizations_services';
import { CompanyServices } from '../../services/company-services';

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

  constructor(private route: ActivatedRoute, private ticketService: Tickets_Services, private tokenServices: Token, private notificacao: Notificacao, private authService: Auth_Services, private organization_services: Organization_services, private company_services: CompanyServices) {
    this.id = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void{
    this.LoadTickets();
    this.GetAllTags();
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
          this.ticket.interactions = (data.interactions ?? [])
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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

   CloseTicket(){

    let request: ChangeTicketStatusRequest = {
      TicketId: this.id,
      Status: 2
    };

    this.ticketService.ChangeTicketStatus(request).subscribe({
      next: (response) => {
        if(response.success){
          this.notificacao.sucesso("Ticket Finalizado.");
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

  ReopenTicket(){

    let request: ChangeTicketStatusRequest = {
      TicketId: this.id,
      Status: 4
    };

    this.ticketService.ChangeTicketStatus(request).subscribe({
      next: (response) => {
        if(response.success){
          this.notificacao.sucesso("Ticket Reaberto.");
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
      }
    );
  }

  isEditing = false;

  categories: Category[] = [];

  newCategory = "";

  departaments: Departament[] = [];

  newDepartament = "";

  ticketCategory: Category = {} as Category;
  ticketDepartament: Departament = {} as Departament;

  toggleEditMode(orgId: string) {
    if (this.isEditing) {
      this.isEditing = false;

      if(this.newDepartament !== this.ticketDepartament.id || this.newCategory !== this.ticketCategory.id)
      {
        this.UpdateTicket(orgId);
      }

      return;
    }

  this.organization_services.GetOrganizationById(orgId)
    .subscribe({
      next: (res) => {
        if(res.success){
          this.categories = res.data.categories || [];
          this.departaments = res.data.departaments || [];

          this.ticketCategory = this.categories.find(x => x.name === this.ticket!.category)!;
          this.ticketDepartament = this.departaments.find(x => x.name === this.ticket!.departament)!;

          this.newCategory = this.ticketCategory.id;
          this.newDepartament = this.ticketDepartament?.id;
          
          this.isEditing = true;
        }
        else
        {
          this.notificacao.erro(res.errors);
        }
      },
      error: (err) => {
        this.notificacao.alerta(err?.error?.errors);
      }
    });
  }

  UpdateTicket(orgId: string){
    let request: ChangeTicketCategoryAndDepartament = {
      Id: this.ticket!.id,
      OrganizationId: orgId,
      CategoryId: this.newCategory,
      DepartamentId: this.newDepartament
    }

    this.ticketService.UpdateTicket(request)
      .subscribe({
        next: (res) => {
          if(res.success){
            this.notificacao.sucesso("Ticket editado.")
            this.LoadTickets();
          }
          else
          {
            this.notificacao.erro(res.errors)
          }
        },
        error: (err) => {
          this.notificacao.alerta(err?.error?.errors);
        }
      }
    );
  }

  getButtonText(): string {
    if (!this.isEditing) {
      return 'Editar Ticket';
    }

    const hasChanges =
      this.newDepartament !== this.ticketDepartament.id ||
      this.newCategory !== this.ticketCategory.id;

    return hasChanges ? 'Confirmar' : 'Cancelar';
  }

  tags: Tag[] = []
  selectedTag: Tag | null = null;

  UpdateTicketTags(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    
    if (this.ticket?.tags.some(t => t.id === selectedValue) || selectedValue == null) {
      selectElement.selectedIndex = 0;
      return;
    }

    let tag: AddTagInTicketRequest = {
      TicketId: this.ticket!.id,
      TagId: selectedValue
    };

    this.ManageTagInTicket(tag);
    selectElement.selectedIndex = 0;

    this.LoadTickets();
  }

  RemoveTicketTag(tagId: string){

    let tag: AddTagInTicketRequest = {
      TicketId: this.ticket!.id,
      TagId: tagId
    };

    this.ManageTagInTicket(tag);

    this.LoadTickets();
  }

  GetAllTags(){
    this.company_services.GetAllTags()
    .subscribe({
      next: (res) => {
        if(res.success){
          this.tags = res.data;
        }
        else
        {
          this.notificacao.erro(res.errors);
        }
      },
      error: (err) => {
        this.notificacao.erro(err?.error?.erros);
      }
    })
  }

  ManageTagInTicket(request: AddTagInTicketRequest){
    this.ticketService.ManageTagInTicket(request)
    .subscribe({
      next: (res) => {
        if(res.success){
          this.LoadTickets();
          this.notificacao.sucesso("Tag atualizada no ticket.");
        }
        else{
          this.notificacao.erro(res.errors);
        }
      },
      error: (err) => {
        this.notificacao.erro(err?.error?.erros);
      }
    })
  }
}
