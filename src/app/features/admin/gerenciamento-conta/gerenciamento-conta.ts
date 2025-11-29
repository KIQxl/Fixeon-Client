import { Component } from '@angular/core';
import { Auth_Services } from '../../../core/services/auth-services';
import { Notificacao } from '../../../core/services/notificacao';
import { ApplicationUser } from '../../../core/models/AuthModels';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gerenciamento-conta',
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciamento-conta.html',
  styleUrl: './gerenciamento-conta.css'
})
export class GerenciamentoConta {
  constructor(private auth_services: Auth_Services, private notification: Notificacao){}

  user: ApplicationUser = { id: "", username: "", email: "", phoneNumber: '', jobTitle: '', profilePictureUrl: '', organization: {organizationName: "", organizationId: ""}, roles: []};

  ngOnInit(){
    this.GetUserById();
  }


  GetUserById(){
    let id = this.auth_services.GetStorageItem("id");
    this.auth_services.GetUserById(id!)
    .subscribe({
      next: (response) => {
        this.user = response.data
        console.log(response.data)
      },
      error: (err) => {
        this.notification.erro(err);
      }
    })
  }
}
