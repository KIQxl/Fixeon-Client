import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';
import { Solicitacoes } from './pages/solicitacoes/solicitacoes';
import { DetalhesChamado } from './pages/detalhes-chamado/detalhes-chamado';
import { Login } from './pages/login/login';
import { NovoChamado } from './pages/novo-chamado/novo-chamado';
import { DashboardGerenciamento } from './pages/dashboard-gerenciamento/dashboard-gerenciamento';
import { GerenciamentoUsuarios } from './pages/gerenciamento-usuarios/gerenciamento-usuarios';
import { GerenciamentoConta } from './pages/gerenciamento-conta/gerenciamento-conta';
import { NovoUsuario } from './pages/novo-usuario/novo-usuario';
import { GerenciamentoApp } from './pages/gerenciamento-app/gerenciamento-app';
import { AnaliseComponent } from './pages/analise-component/analise-component';

export const routes: Routes = [
    {
      path: '',
      component: Login
    },
    {
      path: 'dashboard',
      component: DashboardComponent
    },
    {
      path: 'solicitacoes',
      component: Solicitacoes
    },
    {
      path: 'solicitacoes/:id',
      component: DetalhesChamado
    },
    {
      path: 'novo-chamado',
      component: NovoChamado
    },
    {
      path: 'gerenciamento',
      component: DashboardGerenciamento
    },
    {
      path: 'usuarios',
      component: GerenciamentoUsuarios
    },
    {
      path: 'conta',
      component: GerenciamentoConta
    },
    {
      path: 'novo-usuario',
      component: NovoUsuario
    },
    {
      path: 'gerenciamento-app',
      component: GerenciamentoApp
    },
    {
      path: 'analise',
      component: AnaliseComponent
    }
];
