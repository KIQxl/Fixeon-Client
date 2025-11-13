import { Component } from '@angular/core';
import { Auth_Services } from '../../../core/services/auth-services';
import { Notificacao } from '../../../core/services/notificacao';
import { ApplicationUser } from '../../../core/models/AuthModels';

@Component({
  selector: 'app-gerenciamento-conta',
  imports: [],
  templateUrl: './gerenciamento-conta.html',
  styleUrl: './gerenciamento-conta.css'
})
export class GerenciamentoConta {
  constructor(private auth_services: Auth_Services, private notification: Notificacao){}

  user: ApplicationUser = { id: "", username: "", email: "", organization: {organizationName: "", organizationId: ""}, roles: []};

  ngOnInit(){
    this.GetUserById();
  }


  GetUserById(){
    let id = this.auth_services.GetStorageItem("id");
    this.auth_services.GetUserById(id!)
    .subscribe({
      next: (response) => {
        this.user = response.data
      },
      error: (err) => {
        this.notification.erro(err);
      }
    })
  }
}
