import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CreateCompanyRequest } from '../../../core/models/CompanyModels';
import { FormsModule } from "@angular/forms";
import { AddressServices } from '../../../core/services/address-services';
import { Notificacao } from '../../../core/services/notificacao';
import { CompanyServices } from '../../../core/services/company-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-master-register-company',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './master-register-company.html',
  styleUrl: './master-register-company.css'
})
export class MasterRegisterCompany {
  constructor(private address_services: AddressServices, private notification: Notificacao, private company_services: CompanyServices, private router: Router){}

  request: CreateCompanyRequest = {
    Name: "",
    CNPJ: "",
    Email: "",
    PhoneNumber: "",
    Street: "",
    Neighborhood: "",
    Number: "",
    City: "",
    State: "",
    PostalCode: "",
    Country: ""
  };

  countries: string[] = [];

  ngOnInit(){
    this.address_services.GetCountries()
    .subscribe({
      next: (res) => {
        this.countries = res
      }
    });
  }

  onSubmitForm(){

    this.RemoveSpecialCaractersFromCepAndCNPJ();

    this.company_services.CreateCompany(this.request)
    .subscribe({
      next: (res) => {
        if(res.success){
          this.notification.sucesso("Empresa Cadastrada.");
          this.router.navigate(['/master-list-companies']);
        }
      }
    });
  }

  FillAddressValues(){
    this.address_services.GetAddressByCEP(this.request.PostalCode)
    .subscribe({
      next: (res) => {
        this.request.Street = res.logradouro;
        this.request.Neighborhood = res.bairro;
        this.request.City = res.localidade;
        this.request.State = res.estado;
        this.request.PostalCode = res.cep;
      },
      error: (err) => {
        this.notification.erro("O cep informado não é válido.")
        this.request.Street = "";
        this.request.Neighborhood = "";
        this.request.City = "";
        this.request.State = "";
        this.request.PostalCode = "";
      }
    })
  }

  applyCepMask(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // remove tudo que não for número
    let digits = value.replace(/\D/g, '');

    // limita a 8 dígitos
    digits = digits.substring(0, 8);

    // aplica máscara XXXXX-XXX
    if (digits.length > 5) {
      value = digits.substring(0, 5) + '-' + digits.substring(5);
    } else {
      value = digits;
    }

    // atualiza input e model
    input.value = value;
    this.request.PostalCode = value;
  }

  applyCnpjMask(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // remove tudo que não for número
    let digits = value.replace(/\D/g, '');

    // limita a 14 dígitos (tamanho do CNPJ)
    digits = digits.substring(0, 14);

    // aplica máscara passo a passo
    if (digits.length > 2) {
      digits = digits.replace(/^(\d{2})(\d)/, "$1.$2");
    }
    if (digits.length > 5) {
      digits = digits.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    }
    if (digits.length > 8) {
      digits = digits.replace(/\.(\d{3})(\d)/, ".$1/$2");
    }
    if (digits.length > 12) {
      digits = digits.replace(/(\d{4})(\d)/, "$1-$2");
    }

    this.request.CNPJ = digits;
  }

  RemoveSpecialCaractersFromCepAndCNPJ()
  {
    this.request.CNPJ = this.request.CNPJ.replace(/\D/g, '');
    this.request.PostalCode = this.request.PostalCode.replace(/\D/g, '');
  }
}
