import { Routes } from "@angular/router";
import { AnaliseComponent } from "./features/admin/analise-component/analise-component";
import { CreateOrganizationComponent } from "./features/admin/create-organization-component/create-organization-component";
import { DashboardGerenciamento } from "./features/admin/dashboard-gerenciamento/dashboard-gerenciamento";
import { GerenciamentoApp } from "./features/admin/gerenciamento-app/gerenciamento-app";
import { GerenciamentoConta } from "./features/admin/gerenciamento-conta/gerenciamento-conta";
import { GerenciamentoUsuarios } from "./features/admin/gerenciamento-usuarios/gerenciamento-usuarios";
import { NovoUsuario } from "./features/admin/novo-usuario/novo-usuario";
import { OrganizationViewComponent } from "./features/admin/organization-view-component/organization-view-component";
import { Login } from "./features/auth/login/login";
import { DashboardComponent } from "./features/workspace/dashboard-component/dashboard-component";
import { DetalhesChamado } from "./features/workspace/detalhes-chamado/detalhes-chamado";
import { NovoChamado } from "./features/workspace/novo-chamado/novo-chamado";
import { Solicitacoes } from "./features/workspace/solicitacoes/solicitacoes";
import { authGuard } from "./core/guards/auth-guard";
import { MasterDashboardComponent } from "./features/master-admin/master-dashboard-component/master-dashboard-component";
import { MasterRegisterCompany } from "./features/master-admin/master-register-company/master-register-company";
import { MasterRegisterUser } from "./features/master-admin/master-register-user/master-register-user";
import { MasterListCompanies } from "./features/master-admin/master-list-companies/master-list-companies";
import { MasterManagementCompany } from "./features/master-admin/master-management-company/master-management-company";

export const routes: Routes = [
    {
      path: '',
      component: Login
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin', 'Analista', 'Usuario']
      }
    },
    {
      path: 'solicitacoes',
      component: Solicitacoes,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin', 'Analista', 'Usuario']
      }
    },
    {
      path: 'solicitacoes/:id',
      component: DetalhesChamado,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin', 'Analista', 'Usuario']
      }
    },
    {
      path: 'novo-chamado',
      component: NovoChamado,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin', 'Analista', 'Usuario']
      }
    },
    {
      path: 'gerenciamento',
      component: DashboardGerenciamento,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin', 'Analista', 'Usuario']
      }
    },
    {
      path: 'usuarios',
      component: GerenciamentoUsuarios,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin']
      }
    },
    {
      path: 'conta',
      component: GerenciamentoConta,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin', 'Analista', 'Usuario']
      }
    },
    {
      path: 'novo-usuario',
      component: NovoUsuario,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin']
      }
    },
    {
      path: 'gerenciamento-app',
      component: GerenciamentoApp,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin', 'Analista']
      }
    },
    {
      path: 'analise',
      component: AnaliseComponent,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin']
      }
    },
    {
      path: 'org/:id',
      component: OrganizationViewComponent,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin']
      }
    },
    {
      path: 'create-organization',
      component: CreateOrganizationComponent,
      canActivate: [authGuard],
      data: {
        roles: ['Admin', 'MasterAdmin']
      }
    },
    {
      path: 'master-dashboard',
      component: MasterDashboardComponent,
      canActivate: [authGuard],
      data: {
        roles: ['MasterAdmin']
      }
    },
    {
      path: 'master-register-company',
      component: MasterRegisterCompany,
      canActivate: [authGuard],
      data: {
        roles: ['MasterAdmin']
      }
    },
    {
      path: 'master-register-admin',
      component: MasterRegisterUser,
      canActivate: [authGuard],
      data: {
        roles: ['MasterAdmin']
      }
    },
    {
      path: 'master-list-companies',
      component: MasterListCompanies,
      canActivate: [authGuard],
      data: {
        roles: ['MasterAdmin']
      }
    },
    {
      path: 'master-management-company',
      component: MasterManagementCompany,
      canActivate: [authGuard],
      data: {
        roles: ['MasterAdmin']
      }
    }
];