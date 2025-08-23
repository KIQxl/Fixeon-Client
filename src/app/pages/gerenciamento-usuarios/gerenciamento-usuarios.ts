import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth_Services } from '../../services/auth-services';
import { Notificacao } from '../../services/notificacao';
import { ApplicationUser, Organization, UpdateApplicationUser } from '../../models/AuthModels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-gerenciamento-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciamento-usuarios.html',
  styleUrl: './gerenciamento-usuarios.css'
})
export class GerenciamentoUsuarios {
  users: ApplicationUser [] = [];
  selectedUser: ApplicationUser = { id: '', username: '', email: '', organization: null, organizationId: null, roles: [] };
  orgs: Organization [] = [];
  roles: string [] = [];
  orgId: string = "";
  @ViewChild('dialogEditUser') dialogEditUser!: HTMLDialogElement;
  @ViewChild('dialogEditRoles') dialogEditRoles!: HTMLDialogElement;
  constructor(private auth_services: Auth_Services, private notification: Notificacao){

  }

  ngOnInit(){
    this.GetAllUsers();
    this.GetAllRoles();
    this.GetOrganizations();
  }

  GetAllUsers(){
    this.auth_services.GetAllUsers()
    .subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        this.notification.erro(err);
      }
    })
  }

  openDialog(dialog: HTMLDialogElement, user: ApplicationUser){
    this.selectedUser = { ...user, roles: [...user.roles] };

    if (!this.selectedUser.organization) {
      this.selectedUser.organization = null;
    }

    dialog.showModal();
  }

  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }

  EditUser() {

    let request: UpdateApplicationUser = {
      id: this.selectedUser.id,
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      organizationId: this.selectedUser.organizationId ?? null
    }

    console.log(request)

    this.auth_services.UpdateApplicationUser(request)
    .subscribe({
      next: (response) => {
        this.notification.sucesso("Alterações confirmadas.");
        this.GetAllUsers();
      },
      error: (err) => {
        this.notification.erro(err);
        console.log(err)
      }
    });
  }

  EditRoles(){

  }

  remover(user: ApplicationUser) {
    console.log("Remover usuário:", user);
  }

  GetOrganizations(){
    this.auth_services.GetAllOrganizations()
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
