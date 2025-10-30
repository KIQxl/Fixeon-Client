import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Organization_services } from '../../services/organizations_services';
import { Notificacao } from '../../services/notificacao';
import { CreateOrganizationRequest, CreateSlaInOrganizationRequest, Organization } from '../../models/AuthModels';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-organization-component',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './create-organization-component.html',
  styleUrl: './create-organization-component.css'
})

export class CreateOrganizationComponent {

  constructor(private organization_services: Organization_services, private notification: Notificacao, private route: Router){}

  organization: CreateOrganizationRequest = {
    Name: '',
    Email: '',
    CNPJ: '',
    Categories: [] as string[],
    Departaments: [] as string [],
    Slas: [] as CreateSlaInOrganizationRequest []
  };

  newCategory = '';

  addCategory() {

    const category = this.newCategory.trim();
    if (category && !this.organization.Categories.includes(category)) {
      this.organization.Categories.push(category);
    }
    this.newCategory = '';
  }

  removeCategory(index: number) {
    this.organization.Categories.splice(index, 1);
  }

  newDepartament = '';

  addDepartament() {
    const departament = this.newDepartament.trim();
    if (departament && !this.organization.Departaments.includes(departament)) {
      this.organization.Departaments.push(departament);
    }
    this.newDepartament = '';
  }

  removeDepartament(index: number) {
    this.organization.Departaments.splice(index, 1);
  }

  onSubmit() {
    this.organization.CNPJ = this.organization.CNPJ.replace(/\D/g, '');
    console.log('Organização cadastrada:', this.organization);
    
    this.organization_services.CreateOrganization(this.organization)
    .subscribe({
      next: (res) => {
        this.notification.sucesso("Organização cadastrada!");
        this.route.navigate(['/gerenciamento-app']);
      },
      error: (err) => {
        this.notification.erro(err?.errors);
      } 
    })
  }

  cancel() {
    // redirecionar ou limpar formulário
  }

  onCnpjInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // remove tudo que não é número

    // aplica a máscara visual conforme o usuário digita
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 8) {
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    }
    if (value.length > 12) {
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }

    // atualiza valor formatado
    input.value = value;
    this.organization.CNPJ = value;
  }

  handleEnterCategory(event: Event) {
  event.preventDefault();
  this.addCategory();
}

handleEnterDepartament(event: Event) {
  event.preventDefault();
  this.addDepartament();
}
}
