import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Company } from '../../../core/models/CompanyModels';
import { CommonModule } from '@angular/common';
import { CompanyServices } from '../../../core/services/company-services';
import { Notificacao } from '../../../core/services/notificacao';

@Component({
  selector: 'app-master-list-companies',
  imports: [RouterModule, CommonModule],
  templateUrl: './master-list-companies.html',
  styleUrl: './master-list-companies.css'
})
export class MasterListCompanies {
  constructor(private company_services: CompanyServices, private notification: Notificacao){}

  companies: Company [] = [];

  ngOnInit(){
    this.GetAllCompanies();
  }

  GetAllCompanies(){
    this.company_services.GetAllCompanies()
    .subscribe({
      next: (res) => {
        if(res.success){
          this.companies = res.data
          console.log(this.companies)
        }
        else{
          this.notification.erro(res.errors)
        }
      }
    })
  }
}
