import { Component } from '@angular/core';
import { CreateAccountRequest, Organization } from '../../../core/models/AuthModels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth_Services } from '../../../core/services/auth-services';
import { Notificacao } from '../../../core/services/notificacao';
import { Router } from '@angular/router';
import { Organization_services } from '../../../core/services/organizations_services';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-novo-usuario',
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './novo-usuario.html',
  styleUrl: './novo-usuario.css'
})

export class NovoUsuario {

  constructor(private auth_services: Auth_Services, private organization_services: Organization_services, private notification: Notificacao, private router: Router){

  }

  ngOnInit(){
    this.GetOrganizations();
    this.GetAllRoles();
  }

  novoUsuario: CreateAccountRequest = { username: "", email: "", phoneNumber: "", jobTitle: "", profilePictureUrl: null, password: "", passwordConfirm: "", organizationId: null, companyId: null, roles: []};
  orgs: Organization[] = [];
  roles: string[] = [];

  GetOrganizations(){
    this.organization_services.GetAllOrganizations()
    .subscribe({
      next: (response) => {
        this.orgs = response.data
      },
      error: (err) => {
        this.notification.erro(err);
        console.log(err)
      }
    })
  }

  GetAllRoles(){
    this.auth_services.GetAllRoles()
    .subscribe({
      next: (response) => {
        this.roles = response.data
      },
      error: (err) => {
        this.notification.erro(err);
        console.log(err)
      }
    })
  }

  // CadastrarUsuario(){
  //   this.auth_services.CreeateAccount(this.novoUsuario)
  //   .subscribe({
  //     next: (response) => {
  //       this.notification.sucesso("Novo usuário cadastrado com sucesso!");
  //       this.router.navigate(['/usuarios']);
  //     },
  //     error: (err) => {
  //       this.notification.erro(err.error.errors);
  //       console.log(err)
  //     }
  //   })
  // }
  
  onRoleChange(event: Event, role: string) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      if (!this.novoUsuario.roles.includes(role)) {
        this.novoUsuario.roles.push(role);
      }
    } else {
      this.novoUsuario.roles = this.novoUsuario.roles.filter(r => r !== role);
    }
  }

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;

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


CadastrarUsuario(): void {
  const formData = new FormData();

  formData.append('Username', this.novoUsuario.username);
  formData.append('Email', this.novoUsuario.email);
  formData.append('PhoneNumber', this.novoUsuario.phoneNumber);
  formData.append('Jobtitle', this.novoUsuario.jobTitle);
  if (this.novoUsuario.organizationId) {
    formData.append('OrganizationId', this.novoUsuario.organizationId);
  }
  formData.append('Password', this.novoUsuario.password);
  formData.append('PasswordConfirm', this.novoUsuario.passwordConfirm);
  this.novoUsuario.roles.forEach(role => {
    formData.append('Roles', role);
  });

  if (this.selectedFile) {
    formData.append('ProfilePictureUrl', this.selectedFile, this.selectedFile.name);
  }

  this.auth_services.CreeateAccount(formData)
    .subscribe({
      next: (response) => {
        this.notification.sucesso("Novo usuário cadastrado com sucesso!");
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.notification.erro(err.error.errors);
      }
    })
  }
}
