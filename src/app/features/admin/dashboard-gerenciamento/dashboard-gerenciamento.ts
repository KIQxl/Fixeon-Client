import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HasRole } from "../../../shared/directives/has-role";

@Component({
  selector: 'app-dashboard-gerenciamento',
  imports: [RouterModule, HasRole],
  templateUrl: './dashboard-gerenciamento.html',
  styleUrl: './dashboard-gerenciamento.css'
})
export class DashboardGerenciamento {

}
