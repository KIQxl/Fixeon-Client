import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CompanyServices } from '../../../core/services/company-services';
import { Notificacao } from '../../../core/services/notificacao';
import { ActivatedRoute } from '@angular/router';
import { Company, UpdateCompanyRequest } from '../../../core/models/CompanyModels';
import { FormsModule } from '@angular/forms';
import { AddressServices } from '../../../core/services/address-services';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-master-management-company',
  imports: [CommonModule, FormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './master-management-company.html',
  styleUrl: './master-management-company.css'
})
export class MasterManagementCompany {
  constructor(private company_services: CompanyServices, private notification: Notificacao, private route: ActivatedRoute, private address_services: AddressServices){}
  
  company!: Company;
  updateRequest!: UpdateCompanyRequest;
  abaAtiva: 'visaoGeral' | 'usuarios' | 'configuracoes' | 'atividade' = 'visaoGeral';

  ngOnInit(){
    this.GetCompanyById();
  }

  mudarAba(novaAba: 'visaoGeral' | 'usuarios' | 'configuracoes' | 'atividade') {
    this.abaAtiva = novaAba;
  }

  isEditing = false;

  ToggleEdit(){
    this.isEditing = !this.isEditing;

    this.BindRequest(this.company);

    if(!this.isEditing){
      let resetRequest!: UpdateCompanyRequest;
      this.updateRequest = resetRequest
    }
  }

  GetCompanyById(){
    let id = String(this.route.snapshot.paramMap.get('id'));

    this.company_services.GetCompanyById(id)
    .subscribe({
      next: (res) => {
        if(res.success)
        {
          this.company = res.data;
          this.BindRequest(res.data);
        }
        else
        {
          res.errors.unshift("Ocorreu um erro.");
          this.notification.erro(res.errors);
        }
      }
    });
  }

  FillAddressValues(){
    this.address_services.GetAddressByCEP(this.updateRequest.PostalCode)
    .subscribe({
      next: (res) => {
        this.updateRequest.Street = res.logradouro;
        this.updateRequest.Neighborhood = res.bairro;
        this.updateRequest.City = res.localidade;
        this.updateRequest.State = res.estado;
        this.updateRequest.PostalCode = res.cep;
      },
      error: (err) => {
        this.notification.erro("O cep informado não é válido.")
        this.updateRequest.Street = "";
        this.updateRequest.Neighborhood = "";
        this.updateRequest.City = "";
        this.updateRequest.State = "";
        this.updateRequest.PostalCode = "";
      }
    })
  }


  SubmitCompanyChanges(){
    
  }

  BindRequest(company: Company){
    let object: UpdateCompanyRequest = {
      Name: company.name,
      CNPJ: company.cnpj,
      Email: company.email,
      PhoneNumber: company.phoneNumber,
      Street: company.address.street,
      Number: company.address.number,
      Neighborhood: company.address.neighborhood,
      City: company.address.city,
      State: company.address.state,
      PostalCode: company.address.postalCode,
      Country: company.address.country
    }

    this.updateRequest = object;
  }
}
