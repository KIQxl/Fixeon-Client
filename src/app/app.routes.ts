import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';
import { Solicitacoes } from './pages/solicitacoes/solicitacoes';
import { DetalhesChamado } from './pages/detalhes-chamado/detalhes-chamado';
import { Login } from './pages/login/login';
import { NovoChamado } from './pages/novo-chamado/novo-chamado';

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
    }
];
