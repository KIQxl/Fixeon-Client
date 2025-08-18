import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tickets_Services } from '../../services/ticket-service';
import { Notificacao } from '../../services/notificacao';
import { Router } from '@angular/router';

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
  constructor(private ticketService: Tickets_Services, private notificacao: Notificacao, private router: Router){}

  titulo: string = '';
  descricao: string = '';
  categoria: string = '';
  prioridade: string = '';
  departamento: string = '';
  anexos: Anexo[] = [];

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
    const id = sessionStorage.getItem('id') ?? '';
    const email = sessionStorage.getItem('email') ?? '';

    if(email == '' || id == ''){
      return;
    }

    const formData = new FormData();

    formData.append('title', this.titulo)
    formData.append('description', this.descricao)
    formData.append('category', this.categoria)
    formData.append('Departament', this.departamento)
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
}
