import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth_Services } from '../../services/auth-services';
import { Notificacao } from '../../services/notificacao';
import { ApplicationUser, AssociateRoleRequest, Organization, UpdateApplicationUser } from '../../models/AuthModels';
import { Organization_services } from '../../services/organizations_services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gerenciamento-app',
  imports: [FormsModule, CommonModule],
  templateUrl: './gerenciamento-app.html',
  styleUrl: './gerenciamento-app.css'
})
export class GerenciamentoApp {
  constructor(private auth_services: Auth_Services, private organization_services: Organization_services, private notification: Notificacao){}
    
  current_orgs: Organization[] = [];
  selectedOrg: Organization | null = null;
  showModalUsuarios: boolean = false;
  showModalConfigs: boolean = false;
  usersByOrg: ApplicationUser[] = [];
  selectedUser: ApplicationUser = { id: '', username: '', email: '', organization: {organizationName: "", organizationId: ""}, roles: [] };
  @ViewChild('dialogEditUser') dialogUser!: ElementRef<HTMLDialogElement>;
  @ViewChild('dialogEditRoles') dialogRoles!: ElementRef<HTMLDialogElement>;
  roles: string [] = [];

  ngOnInit(){
      this.GetOrganizations();
      this.GetAllRoles();
    }

  openModal(org: Organization) {
    this.selectedOrg = org;
    this.showModalUsuarios = true;

    this.GetUserByOrganization(org.id);
  }

  closeModal() {
    this.showModalUsuarios = false;
    this.selectedOrg = null;
  }

  openModalConfigs(org: Organization) {
    this.showModalConfigs = true;

    this.GetOrganizationById(org.id);
  }

  GetOrganizationById(orgId: string){
    this.organization_services.GetOrganizationById(orgId)
    .subscribe({
      next: (response) => {
        console.log(response.data)
        this.selectedOrg = response.data
      },
      error: (err) => {
        this.notification.erro(err);
      }
    })
  }
  
  closeModalConfigs() {
    this.showModalConfigs = false;
    this.selectedOrg = null;
  }

  GetOrganizations(){
    this.organization_services.GetAllOrganizations()
    .subscribe({
      next: (response) => {
        console.log(response.data)
        this.current_orgs = response.data
      },
      error: (err) => {
        this.notification.erro(err);
      }
    })
  }

  GetUserByOrganization(orgId: string ){
    this.auth_services.GetAllUsers(null, null, orgId, null)
    .subscribe({
      next: (response) => {
        this.usersByOrg = response.data
      },
      error: (err) => {
        this.notification.erro(err);
      }
    })
  }

  openDialog(dialog: ElementRef<HTMLDialogElement>, user: ApplicationUser){
    this.selectedUser = {
        ...user,
        roles: [...user.roles],
        organization: user.organization ?? { organizationId: '', organizationName: '' }
    };

    dialog.nativeElement.showModal();
  }

  closeDialog(dialog: ElementRef<HTMLDialogElement>) {
    dialog.nativeElement.close();
  }

  EditUser() {

    let request: UpdateApplicationUser = {
      id: this.selectedUser.id,
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      organizationId: this.selectedUser.organization?.organizationId ?? null
    }

    this.auth_services.UpdateApplicationUser(request)
    .subscribe({
      next: (response) => {
        this.notification.sucesso("Alterações confirmadas.");

        this.closeDialog(this.dialogUser);
      },
      error: (err) => {
        this.notification.erro(err);
        console.log(err)
      }
    });
  }

  onRoleChange(event: Event, role: string) {
  const input = event.target as HTMLInputElement;
  if (input.checked) {
    if (!this.selectedUser.roles.includes(role)) {
      this.selectedUser.roles.push(role);
    }
  } else {
    this.selectedUser.roles = this.selectedUser.roles.filter(r => r !== role);
  }
}

  EditRoles(){
    let request: AssociateRoleRequest = {
      userId: this.selectedUser.id,
      roles: this.selectedUser.roles
    }

    this.auth_services.AssociateRoles(request)
    .subscribe({
      next: (response) => {
        this.notification.sucesso("Perfis alterados.");
        this.closeDialog(this.dialogRoles);
      },
      error: (err) => {
        this.notification.erro(err);
        console.log(err)
      }
    });
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

  showModalAddCategoria = false;

// Função para ABRIR o modal de adicionar categoria
// Você vai chamar esta função no (click) do botão '+' de Categorias
openAddCategoriaModal() {
  this.showModalAddCategoria = true;
}

// Função para FECHAR o modal
closeAddCategoriaModal() {
  this.showModalAddCategoria = false;
}

// Função para lidar com o SUBMIT do formulário
onSaveCategory() {
  // 1. Pegue o valor do input
  // (usando ngModel ou outra técnica de formulário do Angular)
  console.log('Salvando a nova categoria...');

  // 2. Adicione sua lógica para salvar a categoria aqui

  // 3. Feche o modal após salvar
  this.closeAddCategoriaModal();
}
}
