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
}
