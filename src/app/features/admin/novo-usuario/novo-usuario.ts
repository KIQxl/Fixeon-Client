import { Component } from '@angular/core';
import { CreateAccountRequest, Organization } from '../../../core/models/AuthModels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth_Services } from '../../../core/services/auth-services';
import { Notificacao } from '../../../core/services/notificacao';
import { Router } from '@angular/router';
import { Organization_services } from '../../../core/services/organizations_services';

@Component({
  selector: 'app-novo-usuario',
  imports: [CommonModule, FormsModule],
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

  novoUsuario: CreateAccountRequest = { username: "", email: "", password: "", passwordConfirm: "", organizationId: null, companyId: null, roles: []};
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

  CadastrarUsuario(){
    this.auth_services.CreeateAccount(this.novoUsuario)
    .subscribe({
      next: (response) => {
        this.notification.sucesso("Novo usuário cadastrado com sucesso!");
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.notification.erro(err.error.errors);
        console.log(err)
      }
    })
  }
  
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
}
