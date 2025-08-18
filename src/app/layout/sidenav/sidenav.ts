import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth_Services } from '../../services/auth-services';
import { CommonModule } from '@angular/common';
import { HasRole } from '../../directives/has-role';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, CommonModule, HasRole],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav {
  constructor(public auth: Auth_Services){}
}
