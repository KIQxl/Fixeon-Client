import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CreateCompanyRequest } from '../../../core/models/CompanyModels';
import { FormsModule } from "@angular/forms";
import { AddressServices } from '../../../core/services/address-services';
import { Notificacao } from '../../../core/services/notificacao';
import { CompanyServices } from '../../../core/services/company-services';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from "ngx-mask";

@Component({
  selector: 'app-master-register-company',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule, NgxMaskDirective],
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
    this.company_services.CreateCompany(this.request)
    .subscribe({
      next: (res) => {
        if(res.success){
          this.notification.sucesso("Empresa Cadastrada.");
          this.router.navigate(['/master-list-companies']);
        }
        else
        {
          this.notification.erro(res.errors);
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
        this.request.PostalCode = res.cep.replace('-', '');
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
}
