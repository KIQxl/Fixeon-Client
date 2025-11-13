import { Component } from '@angular/core';
import { Auth_Services } from '../../services/auth-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(private auth: Auth_Services, private router: Router) { };

  Logout(){
    this.auth.logout();
  }
}
