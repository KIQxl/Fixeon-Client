import { Component } from '@angular/core';
import { Auth_Services } from '../../../core/services/auth-services';
import { CompanyServices } from '../../../core/services/company-services';

@Component({
  selector: 'app-master-dashboard-component',
  imports: [],
  templateUrl: './master-dashboard-component.html',
  styleUrl: './master-dashboard-component.css'
})
export class MasterDashboardComponent {
  constructor(private company_services: CompanyServices) {}

  // ngOnInit(){
  //   this.GetAllCompanies();
  //   this.GetCompanyById();
  // }

  // GetAllCompanies(){
  //   this.company_services.GetAllCompanies()
  //   .subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     }
  //   });
  // }


  // GetCompanyById(){
  //   this.company_services.GetCompanyById("1C260A5B-4459-46AB-AD23-9841838F4328")
  //   .subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err.error)
  //     }
  //   });
  // }
}
