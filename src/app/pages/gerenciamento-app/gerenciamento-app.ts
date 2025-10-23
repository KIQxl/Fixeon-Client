import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth_Services } from '../../services/auth-services';
import { Notificacao } from '../../services/notificacao';
import { ApplicationUser, AssociateRoleRequest, CreateCategory, CreateDepartament, Organization, UpdateApplicationUser } from '../../models/AuthModels';
import { Organization_services } from '../../services/organizations_services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gerenciamento-app',
  imports: [FormsModule, CommonModule, RouterModule],
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
  }

  openModalConfigs(org: Organization) {
    this.showModalConfigs = true;

    this.GetOrganizationById(org.id);
  }

  GetOrganizationById(orgId: string){
    this.organization_services.GetOrganizationById(orgId)
    .subscribe({
      next: (response) => {
        this.selectedOrg = response.data
      },
      error: (err) => {
        this.notification.erro(err);
      }
    })
  }
  
  closeModalConfigs() {
    this.showModalConfigs = false;
  }

  GetOrganizations(){
    this.organization_services.GetAllOrganizations()
    .subscribe({
      next: (response) => {
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
  showModalAddDepartament = false;

  novaCategoria: string = "";
  novoDepartamento: string = "";

  openAddCategoriaModal() {
    this.showModalAddCategoria = true;
  }

  closeAddCategoriaModal() {
    this.showModalAddCategoria = false;
  }

  openAddDepartamentModal() {
    this.showModalAddDepartament = true;
  }

  closeAddDepartamentModal() {
    this.showModalAddDepartament = false;
  }

  onSaveCategory(orgId: string) {
    if (!this.novaCategoria || this.novaCategoria.trim() === '') {
      
      this.notification.erro("Informe um nome para a categoria.");
      return; 
    }

    if (!orgId) {
      this.notification.erro('ID da organização não encontrado. Não é possível salvar.');
      return;
    }

    const request: CreateCategory = {
      organizationId: orgId,
      categoryName: this.novaCategoria.trim()
    };

    this.organization_services.CreateCategory(request)
    .subscribe({
      next: (response) => {
        this.notification.sucesso("Categoria adicionada");

        this.closeAddCategoriaModal();
        this.closeModalConfigs();

        setTimeout(() => {
          this.openModalConfigs(this.selectedOrg!);
        }, 50)
      },
      error: (err) => {
        this.notification.erro(err);
      }
    });

    this.closeAddCategoriaModal();
  }

  onSaveDepartament(orgId: string) {

    if (!this.novoDepartamento || this.novoDepartamento.trim() === '') {
      
      this.notification.erro("Informe um nome para o departamento.");
      return; 
    }

    if (!orgId) {
      this.notification.erro('ID da organização não encontrado. Não é possível salvar.');
      return;
    }

    const request: CreateDepartament = {
      organizationId: orgId,
      departamentName: this.novoDepartamento.trim()
    };

    this.organization_services.CreateDepartament(request)
    .subscribe({
      next: (response) => {
        this.notification.sucesso("Departamento adicionado");

        this.closeAddDepartamentModal();
        this.closeModalConfigs();

        setTimeout(() => {
          this.openModalConfigs(this.selectedOrg!);
        }, 50)
      },
      error: (err) => {
        this.notification.erro(err);
      }
    });
  }
}
