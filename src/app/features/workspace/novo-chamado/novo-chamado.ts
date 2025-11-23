import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tickets_Services } from '../../../core/services/ticket-service';
import { Notificacao } from '../../../core/services/notificacao';
import { Router } from '@angular/router';
import { Token } from '../../../core/services/token';
import { Organization_services } from '../../../core/services/organizations_services';
import { Organization } from '../../../core/models/AuthModels';
import { Category, Departament } from '../../../core/models/Ticket';

export interface Anexo {
  file: File;
  preview: string | null;
}

@Component({
  selector: 'app-novo-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novo-chamado.html',
  styleUrl: './novo-chamado.css'
})
export class NovoChamado {
  constructor(private ticketService: Tickets_Services, private notificacao: Notificacao, private router: Router, private token: Token, private organization_services: Organization_services){}

  titulo: string = '';
  descricao: string = '';
  categoria: string = '';
  prioridade: string = '';
  departamento: string = '';
  anexos: Anexo[] = [];

  organization!: Organization; 

  ngOnInit(): void{
    this.GetOrganizationData();
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.adicionarArquivos(files);
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
      this.adicionarArquivos(files);
    }
  }

  adicionarArquivos(files: File[]) {
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

  removerAnexo(index: number) {
    this.anexos.splice(index, 1);
  }

  abrirChamado() {
    const tokenPayload = this.token.GetPayload();
    const email = tokenPayload?.email ?? '';
    const id = tokenPayload?.id ?? '';

    if(email == '' || id == ''){
      return;
    }

    const formData = new FormData();

    formData.append('title', this.titulo)
    formData.append('description', this.descricao)
    formData.append('category', this.categoria)
    formData.append('departament', this.departamento)
    formData.append('priority', this.prioridade)

    this.anexos.forEach((anexo, index) => {
      formData.append('files', anexo.file, anexo.file.name)
    });

    this.ticketService.CreateTicket(formData).subscribe({
      next: (response) => {
        if(response.success){
          this.notificacao.sucesso("Chamado aberto com sucesso.");
          this.router.navigate(['/solicitacoes']);
        }
        else{
          this.notificacao.erro(response.errors);
        }
      },
      error: (err) => {
        this.notificacao.erro(err?.error?.errors);
      }
    });
  }

  GetOrganizationData(){
    var tokenPayload = this.token.GetPayload();
    var organizationId = tokenPayload?.organizationId || "";
    this.organization_services.GetOrganizationById(organizationId)
    .subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.organization = response.data;
          this.organization.categories = this.organization.categories?.sort((a, b) => a.name.localeCompare(b.name)) || [];
          this.organization.departaments = this.organization.departaments?.sort((a, b) => a.name.localeCompare(b.name)) || [];
        } else {
          this.organization = { } as Organization;
          this.organization.categories = [] as Category [];
          this.organization.departaments = [] as Departament [];
          this.notificacao.erro(response.errors);
        }
      },
      error: (err) => {
        this.organization = {} as Organization;
        this.notificacao.erro(err?.error?.errors || "Erro ao buscar organização");
      }
    });
  }

  CreateDeafultOrganizationTicket(){
    const formData = new FormData();

    let tokenPayload = this.token.GetPayload();

    let title = "Usuário sem vínculo com organização.";
    const reportMessage = `
      Usuário sem vínculo com organização.

      Um de nossos usuários cadastrados reportou que se encontra sem vínculo com nenhuma organização ativa.  

      Esse tipo de ocorrência não permite que o mesmo abra ou interaja com chamados, o que pode causar inconsistências em permissões e relatórios.  

      **Detalhes do usuário identificado:**  
      - Nome: ${tokenPayload?.username}  
      - E-mail: ${tokenPayload?.email}  
      - ID do usuário: ${tokenPayload?.id}  
      - Reportado em: ${new Date().toLocaleString('pt-BR')}

      **Observações do usuário:**
      ${this.observation}

      **Ação recomendada:**  
      1. Verificar se o usuário deve pertencer a uma organização existente.  
      2. Caso sim, vincular o usuário manualmente.  
      3. Caso contrário, avaliar se o usuário deve ser desativado ou excluído.  

      Entre em contato com o usuário para obter mais informações.
      `;

    let category = "SEM ORGANIZAÇÃO";
    let departament = "SEM ORGANIZAÇÃO";

    formData.append('title', title)
    formData.append('description', reportMessage)
    formData.append('category', category)
    formData.append('Departament', departament)
    formData.append('priority', "3")

    this.ticketService.CreateTicket(formData).subscribe({
      next: (response) => {
        if(response.success){
          this.notificacao.sucesso("Sua situação foi reportada para a equipe, dentro de alguns instantes um de nossos analistas irá realizar o vínculo com sua organização.");
          this.router.navigate(['/solicitacoes']);
        }
        else{
          this.notificacao.erro(response.errors);
        }
      },
      error: (err) => {
        this.notificacao.erro(err?.error?.errors);
      }
    });
  }

  showModal = false;
  observation = '';

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.observation = '';
  }
}
