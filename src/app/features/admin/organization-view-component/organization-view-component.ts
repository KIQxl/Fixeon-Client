import { Component, ElementRef, ViewChild } from '@angular/core';
import { Organization_services } from '../../../core/services/organizations_services';
import { Notificacao } from '../../../core/services/notificacao';
import { ActivatedRoute } from '@angular/router';
import { ApplicationUser, AssociateRoleRequest, CreateCategory, CreateDepartament, CreateSla, DeleteCategoryOrDepartament, Organization, UpdateApplicationUser } from '../../../core/models/AuthModels';
import { FormsModule } from '@angular/forms';
import { Auth_Services } from '../../../core/services/auth-services';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../core/models/Response';

@Component({
  selector: 'app-organization-view-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './organization-view-component.html',
  styleUrl: './organization-view-component.css'
})
export class OrganizationViewComponent {
  constructor(private organization_services: Organization_services, private notificacao: Notificacao, private route: ActivatedRoute, private auth_services: Auth_Services) { }

  organization!: Organization;
  users: ApplicationUser[] = [];
  selectedUser: ApplicationUser = { id: '', username: '', email: '', organization: { organizationName: "", organizationId: "" }, roles: [] };
  @ViewChild('dialogEditUser') dialogUser!: ElementRef<HTMLDialogElement>;
  @ViewChild('dialogEditRoles') dialogRoles!: ElementRef<HTMLDialogElement>;
  orgs: Organization[] = [];
  roles: string[] = [];
  showModalConfigs: boolean = false;

  ngOnInit() {
    this.GetOrganization();
    this.GetUsersByOrganization();
    this.GetAllRoles();
    this.GetOrganizations();
  }

  GetOrganization() {
    var id = String(this.route.snapshot.paramMap.get('id'));

    this.organization_services.GetOrganizationById(id)
      .subscribe({
        next: (res) => {
          this.organization = res.data;
        },
        error: (err) => {
          this.notificacao.alerta(err)
        }
      })
  }

  // PREENCHER TABELA DE USUARIOS E SEUS RESPECTIVOS MODAIS DE AÇÕES
  GetUsersByOrganization() {
    var id = String(this.route.snapshot.paramMap.get('id'));

    this.auth_services.GetAllUsers(null, null, id, null)
      .subscribe({
        next: (res) => {
          this.users = res.data;
        },
        error: (err) => {
          this.notificacao.alerta(err)
        }
      })
  }

  openDialog(dialog: ElementRef<HTMLDialogElement>, user: ApplicationUser) {
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
        this.notificacao.sucesso("Alterações confirmadas.");
        this.GetUsersByOrganization();

        this.closeDialog(this.dialogUser);
      },
      error: (err) => {
        this.notificacao.erro(err);
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

  EditRoles() {
    let request: AssociateRoleRequest = {
      userId: this.selectedUser.id,
      roles: this.selectedUser.roles
    }

    this.auth_services.AssociateRoles(request)
    .subscribe({
      next: (response) => {
        this.notificacao.sucesso("Perfis alterados.");
        this.GetUsersByOrganization();

        this.closeDialog(this.dialogRoles);
      },
      error: (err) => {
        this.notificacao.erro(err);
        console.log(err)
      }
    });
  }

  GetAllRoles() {
    this.auth_services.GetAllRoles()
    .subscribe({
      next: (response) => {
        this.roles = response.data
      },
      error: (err) => {
        this.notificacao.erro(err);
        console.log(err)
      }
    })
  }

  GetOrganizations() {
    this.organization_services.GetAllOrganizations()
      .subscribe({
        next: (response) => {
          this.orgs = response.data
        },
        error: (err) => {
          this.notificacao.erro(err);
          console.log(err)
        }
      }
    )
  }

  // PRENCHER CATEGORIAS E SEUS RESPECTIVOS MODAIS DE AÇÕES
  showModalAddCategoria = false;
  
  novaCategoria: string = "";
  
  openAddCategoriaModal() {
    this.showModalAddCategoria = true;
  }
  
  closeAddCategoriaModal() {
    this.showModalAddCategoria = false;
  }

  onSaveCategory(orgId: string) {
    if (!this.novaCategoria || this.novaCategoria.trim() === '') {

      this.notificacao.erro("Informe um nome para a categoria.");
      return;
    }

    if (!orgId) {
      this.notificacao.erro('ID da organização não encontrado. Não é possível salvar.');
      return;
    }

    const request: CreateCategory = {
      organizationId: orgId,
      categoryName: this.novaCategoria.trim()
    };

    this.organization_services.CreateCategory(request)
      .subscribe({
        next: (response) => {
          this.notificacao.sucesso("Categoria adicionada");

          this.closeAddCategoriaModal();
          this.closeModalConfigs();

          this.novaCategoria = "";

          setTimeout(() => {
            this.GetOrganization();
          }, 50)
        },
        error: (err) => {
          this.notificacao.erro(err);
        }
      });

    this.closeAddCategoriaModal();
  }

  //PRENCHER DEPARTAMENTOS E SEUS RESPECTIVOS MODAIS DE AÇÕES
  showModalAddDepartament = false;

  novoDepartamento: string = "";

  openAddDepartamentModal() {
    this.showModalAddDepartament = true;
  }

  closeAddDepartamentModal() {
    this.showModalAddDepartament = false;
  }

  onSaveDepartament(orgId: string) {

    if (!this.novoDepartamento || this.novoDepartamento.trim() === '') {

      this.notificacao.erro("Informe um nome para o departamento.");
      return;
    }

    if (!orgId) {
      this.notificacao.erro('ID da organização não encontrado. Não é possível salvar.');
      return;
    }

    const request: CreateDepartament = {
      organizationId: orgId,
      departamentName: this.novoDepartamento.trim()
    };

    this.organization_services.CreateDepartament(request)
      .subscribe({
        next: (response) => {
          this.notificacao.sucesso("Departamento adicionado");

          this.closeAddDepartamentModal();
          this.closeModalConfigs();

          this.novoDepartamento = "";

          setTimeout(() => {
            this.GetOrganization();
          }, 50)
        },
        error: (err) => {
          this.notificacao.erro(err);
        }
      }
    );
  }

  //PREENCHER E SLA E SEUS RESPECTIVOS MODAIS DE AÇÕES

  slaType: number = 0;
  slaPriority: number = 0;
  slaInMinutes: number = 0;

  FindSLA(slaPriority: string, type: number): string | null {
    let sla = this.organization.organizationSLAs.find(s => s.type == type && s.slaPriority == slaPriority);

    let slaInMinutes: number | null = sla ? sla.slaInMinutes : null
    return slaInMinutes != null ? `${slaInMinutes} minutos` : "-";
  }

  showModalAddSLA = false;

  openAddSLAModal() {
    this.showModalAddSLA = true;
  }

  closeAddSLAModal() {
    this.showModalAddSLA = false;
  }
  
  onSaveSLA(orgId: string) {

    if (this.slaType < 1) {
      this.notificacao.erro("Informe o tipo de SLA a ser configurado");
      return;
    }

    if(this.slaPriority < 1){
      this.notificacao.erro("Informe a prioridade da SLA a ser configurada");
      return;
    }

    if(this.slaInMinutes < 1){
      this.notificacao.erro("O prazo de SLA em minutos deve ser maior que 0");
      return;
    }

    if (!orgId) {
      this.notificacao.erro('ID da organização não encontrado. Não é possível salvar.');
      return;
    }

    const request: CreateSla = {
      organizationId: orgId,
      slaInMinutes: Number(this.slaInMinutes),
      slaPriority: this.slaPriority,
      type: this.slaType
    }

    this.organization_services.CreateSLA(request)
    .subscribe({
      next: (res) => {
        if(res.data){
          this.notificacao.sucesso("Alterações de SLA realizadas com sucesso.");

          this.closeAddSLAModal();
          this.closeModalConfigs();

          this.slaInMinutes = 0;
          this.slaPriority = 0;
          this.slaType = 0;

          setTimeout(() => {
            this.GetOrganization();
          }, 50)
        }
      },
      error: (err) => {
         const errors: string[] = err.error?.errors;

        if (errors && errors.length > 0) {
          this.notificacao.erro(`Houve um erro: ${errors.join(', ')}`);
        } else {
          this.notificacao.erro("Ocorreu um erro inesperado ao salvar a SLA.");
        }
      }
    });
  }

  closeModalConfigs() {
    this.showModalConfigs = false;
  }

  openModalConfigs() {
    this.showModalConfigs = true;
  }

  DeleteCategory(id: string){
    let request: DeleteCategoryOrDepartament = {
      OrganizationId: this.organization.id,
      CategoryOrDepartamentId: id,
    }

    this.organization_services.DeleteCategory(request)
    .subscribe({
      next: (res) => {
        this.notificacao.sucesso("Categoria removida.");
        this.GetOrganization();
      },
      error: (err) => {
        this.notificacao.erro(err?.error?.errors)
      }
    });
  }

  DeleteDepartament(id: string){
    let request: DeleteCategoryOrDepartament =  {
      OrganizationId: this.organization.id,
      CategoryOrDepartamentId: id,
    }

    this.organization_services.DeleteDepartament(request)
    .subscribe({
      next: (res) => {
        this.notificacao.sucesso("Departamento removido.");
        this.GetOrganization();
      },
      error: (err) => {
        this.notificacao.erro(err?.error)
        console.log(err)
      }
    });
  }
}
