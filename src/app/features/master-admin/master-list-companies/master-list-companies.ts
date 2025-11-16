import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Company } from '../../../core/models/CompanyModels';
import { CommonModule } from '@angular/common';
import { CompanyServices } from '../../../core/services/company-services';
import { Notificacao } from '../../../core/services/notificacao';
import { NgxMaskPipe } from 'ngx-mask';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-master-list-companies',
  imports: [RouterModule, CommonModule, NgxMaskPipe, FormsModule],
  templateUrl: './master-list-companies.html',
  styleUrl: './master-list-companies.css'
})
export class MasterListCompanies {
  constructor(private company_services: CompanyServices, private notification: Notificacao){}

  companies: Company [] = [];
  filteredCompanies: Company [] = [];

  ngOnInit(){
    this.GetAllCompanies();
  }

  GetAllCompanies(){
    this.company_services.GetAllCompanies()
    .subscribe({
      next: (res) => {
        if(res.success){
          this.companies = res.data
          this.filteredCompanies = res.data
        }
        else{
          this.notification.erro(res.errors)
        }
      }
    })
  }

  searchText: string = "";
  OnSearchChange(){
    if (this.searchText !== '') {
      const search = this.searchText.toLowerCase();
      const filteredMap = new Map<string, any>();

      this.companies.forEach(company => {
        if (
          company.cnpj.toLowerCase().includes(search) ||
          company.name.toLowerCase().includes(search) ||
          company.email.toLowerCase().includes(search)
        ) {
          filteredMap.set(company.cnpj, company); // evita duplicatas
        }
      });

      this.filteredCompanies = Array.from(filteredMap.values());
    }
    else
      this.filteredCompanies = this.companies;
  }
}
