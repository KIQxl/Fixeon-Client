import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class Notificacao {

  constructor(private toastr: ToastrService) { }

  sucesso(mensagem: string, titulo: string = 'Sucesso'){
    this.toastr.success(mensagem, titulo);
  }

  erro(mensagens: string[] | string, titulo: string = 'Erro'){
    if (Array.isArray(mensagens)) {
    mensagens.forEach(mensagem => this.toastr.error(mensagem, titulo));
  } else {
    this.toastr.error(mensagens, titulo);
  }
  }

  info(mensagem: string, titulo: string = 'Informação'){
    this.toastr.info(mensagem, titulo);
  }

  alerta(mensagem: string, titulo: string = 'Alerta'){
    this.toastr.warning(mensagem, titulo);
  }
}
