import { Component } from '@angular/core';
import { Auth_Services } from '../../services/auth-services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notificacao } from '../../services/notificacao';

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
    // this.router.navigate(['/dashboard']);
    this.errorMessages = [];

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        console.log(user)
        this.authService.AddStorage("token", user.token);
        this.authService.AddStorage("id", user.id);
        this.authService.AddStorage("email", user.email);

        this.notificacao.sucesso(`Bem vindo, ${user.username}`);
        this.router.navigate(['/dashboard']);
      },
      error: (errors: string[]) => {
        console.log(errors)
        this.notificacao.erro(errors);
        this.errorMessages = errors;
      }
    });
  }
}
