import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth_Services } from '../../../core/services/auth-services';
import { CompanyServices } from '../../../core/services/company-services';
import { Notificacao } from '../../../core/services/notificacao';
import { CreateAccountRequest } from '../../../core/models/AuthModels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-master-register-user',
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './master-register-user.html',
  styleUrl: './master-register-user.css'
})
export class MasterRegisterUser {
companyId: string | null = null;
  companyName: string = '...'; // Nome da empresa para exibir no título

  // Objeto para o formulário
  request: CreateAccountRequest = {
    email: '',
    username: '',
    phoneNumber: '',
    jobTitle: '',
    password: '',
    passwordConfirm: '',
    companyId: null,
    // Campos não usados nesta tela:
    roles: [], 
    organizationId: null,
    profilePictureUrl: null // Será tratado pelo FormData
  };

  // Propriedades para o upload de imagem
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: Auth_Services,
    private companyService: CompanyServices, // Para buscar o nome da empresa
    private notification: Notificacao
  ) {}

  ngOnInit(): void {
    // Pega o ID da empresa da URL
    this.companyId = this.route.snapshot.paramMap.get('id');
    if (this.companyId) {
      this.request.companyId = this.companyId;
      
      // Opcional: Busca o nome da empresa para exibir no título
      this.companyService.GetCompanyById(this.companyId).subscribe(company => {
        this.companyName = company.data.name;
      });
    } else {
      // Se não houver ID, redireciona ou mostra um erro
      this.notification.erro("ID da empresa não encontrado.");
      this.router.navigate(['/master/empresas']);
    }
  }

  onSubmit(): void {
    // Validações básicas
    if (!this.request.password || this.request.password !== this.request.passwordConfirm) {
      this.notification.erro("As senhas não conferem ou estão vazias.");
      return;
    }

    const formData = new FormData();

    // Adiciona os campos de texto
    formData.append('Email', this.request.email);
    formData.append('Username', this.request.username);
    formData.append('PhoneNumber', this.request.phoneNumber);
    formData.append('JobTitle', this.request.jobTitle || '');
    formData.append('Password', this.request.password);
    formData.append('PasswordConfirm', this.request.passwordConfirm);
    
    // Adiciona o CompanyId
    if (this.request.companyId) {
      formData.append('CompanyId', this.request.companyId);
    }

    // Adiciona o arquivo de imagem
    if (this.selectedFile) {
      // O nome 'ProfilePictureUrl' deve corresponder ao IFormFile no seu DTO do backend
      formData.append('ProfilePictureUrl', this.selectedFile, this.selectedFile.name);
    }

    // Chama o serviço para criar a conta
    // O backend já sabe que deve associar a role 'Admin'
    this.authService.CreeateAccountAdmin(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.notification.sucesso(`Administrador para ${this.companyName} criado com sucesso!`);
          // Redireciona para a página de detalhes da empresa
          this.router.navigate(['/master/empresas', this.companyId]);
        } else {
          this.notification.erro(res.errors);
        }
      },
      error: (err) => {
        this.notification.erro(err?.error?.errors || "Ocorreu um erro inesperado.");
      }
    });
  }

  cancelar(): void {
    // Volta para a página de detalhes da empresa
    this.router.navigate(['/master/empresas', this.companyId]);
  }

  // --- MÉTODOS DE CONTROLE DE UPLOAD (copie e cole da outra tela) ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.notification.erro('Por favor, selecione um arquivo de imagem.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      this.notification.erro('O arquivo é muito grande. O máximo é 5MB.');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  removerImagem(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
