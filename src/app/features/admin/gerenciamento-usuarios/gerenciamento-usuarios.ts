import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth_Services } from '../../../core/services/auth-services';
import { Notificacao } from '../../../core/services/notificacao';
import { ApplicationUser, AssociateRoleRequest, Organization, UpdateApplicationUser } from '../../../core/models/AuthModels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Organization_services } from '../../../core/services/organizations_services';
@Component({
  selector: 'app-gerenciamento-usuarios',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gerenciamento-usuarios.html',
  styleUrl: './gerenciamento-usuarios.css'
})
export class GerenciamentoUsuarios {
  users: ApplicationUser [] = [];
  selectedUser: ApplicationUser = { id: '', username: '', email: '', organization: {organizationName: "", organizationId: ""}, roles: [] };
  orgs: Organization [] = [];
  roles: string [] = [];
  orgId: string = "";
  @ViewChild('dialogEditUser') dialogUser!: ElementRef<HTMLDialogElement>;
  @ViewChild('dialogEditRoles') dialogRoles!: ElementRef<HTMLDialogElement>;
  constructor(private auth_services: Auth_Services, private organization_services: Organization_services, private notification: Notificacao){

  }

  ngOnInit(){
    this.GetAllUsers();
    this.GetAllRoles();
    this.GetOrganizations();
  }

  GetAllUsers(){
    this.auth_services.GetAllUsers(null, null, null, null)
    .subscribe({
      next: (response) => {
        this.users = response.data;
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
        this.GetAllUsers();

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
        this.GetAllUsers();

        this.closeDialog(this.dialogRoles);
      },
      error: (err) => {
        this.notification.erro(err);
        console.log(err)
      }
    });
  }

  remover(user: ApplicationUser) {
  }

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
}
