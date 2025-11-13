import { Component } from '@angular/core';
import { Auth_Services } from '../../../core/services/auth-services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notificacao } from '../../../core/services/notificacao';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { TokenPayload } from '../../../core/models/Response';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessages: string[] = [];


  constructor(private authService: Auth_Services, private router: Router, private notificacao: Notificacao) { }

  login(){
    this.errorMessages = [];

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        const token = user.token;
        const decoded: TokenPayload = jwtDecode(token);

        if (decoded.roles && decoded.roles.includes("MasterAdmin")) {
          this.notificacao.sucesso(`Bem vindo Admin, ${decoded.username}`);
          this.router.navigate(['/master-dashboard']);
        } 
        else 
        {
          this.notificacao.sucesso(`Bem vindo, ${decoded.username}`);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (errors: string[]) => {
        this.notificacao.erro(errors);
        this.errorMessages = errors;
      }
    });
  }
}
