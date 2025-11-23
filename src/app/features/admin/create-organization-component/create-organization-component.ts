import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Organization_services } from '../../../core/services/organizations_services';
import { Notificacao } from '../../../core/services/notificacao';
import { CreateOrganizationRequest, CreateSlaInOrganizationRequest } from '../../../core/models/AuthModels';
import { Router } from '@angular/router';
import { AddressServices } from '../../../core/services/address-services';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-create-organization-component',
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './create-organization-component.html',
  styleUrl: './create-organization-component.css'
})

export class CreateOrganizationComponent {

  constructor(private organization_services: Organization_services, private notification: Notificacao, private route: Router, private address_services: AddressServices){}

  request: CreateOrganizationRequest = {
    Name: '',
    Email: '',
    PhoneNumber: '',
    CNPJ: '',
    Notes: '',
    Street: '',
    Number: '',
    Neighborhood: '',
    City: '',
    State: '',
    PostalCode: '',
    Country: '',
    ProfilePictureUrl: null,
    Categories: [] as string[],
    Departaments: [] as string [],
    Slas: [] as CreateSlaInOrganizationRequest []
  };

  newCategory = '';

  addCategory() {

    const category = this.newCategory.trim();
    if (category && !this.request.Categories.includes(category)) {
      this.request.Categories.push(category);
    }
    this.newCategory = '';
  }

  removeCategory(index: number) {
    this.request.Categories.splice(index, 1);
  }

  newDepartament = '';

  addDepartament() {
    const departament = this.newDepartament.trim();
    if (departament && !this.request.Departaments.includes(departament)) {
      this.request.Departaments.push(departament);
    }
    this.newDepartament = '';
  }

  removeDepartament(index: number) {
    this.request.Departaments.splice(index, 1);
  }

  newSLA: CreateSlaInOrganizationRequest = {
    type: 0,
    slaPriority: 0,
    slaInMinutes: 0
   };

  addSLA() {
    const sla = { ... this.newSLA };
    if (sla.slaInMinutes && sla.slaInMinutes > 0 && sla.slaPriority > 0 && sla.type > 0) {

      let index = this.request.Slas.findIndex(x => x.slaPriority === sla.slaPriority && x.type === sla.type);
      if(index !== -1)
        this.request.Slas.splice(index, 1);

      this.request.Slas.push(sla);
    }

    this.newSLA = {
      type: 0,
      slaPriority: 0,
      slaInMinutes: 0
    };

    console.log(this.request)
  }

  removeSLA(index: number) {
    this.request.Slas.splice(index, 1);
  }

  TranslateSLAPriority(slaPriority: number): string{
    switch(slaPriority){
      case 1:
        return "Baixa";

        case 2:
        return "Média";

        case 3:
        return "Alta";

        default:
          return "-";
    }
  }

  TranslateSLAType(slaType: number){
    switch(slaType){
      case 1:
        return "Primeiro atendimento";

        case 2:
        return "Resolução";

        default:
          return "-";
    }
  }

  // onSubmit() {
  //   this.organization.CNPJ = this.organization.CNPJ.replace(/\D/g, '');    
  //   this.organization_services.CreateOrganization(this.organization)
  //   .subscribe({
  //     next: (res) => {
  //       this.notification.sucesso("Organização cadastrada!");
  //       this.route.navigate(['/gerenciamento-app']);
  //     },
  //     error: (err) => {
  //       this.notification.erro(err?.errors);
  //     } 
  //   })
  // }

  cancel() {
    // redirecionar ou limpar formulário
  }

  handleEnterCategory(event: Event) {
    event.preventDefault();
    this.addCategory();
  }

  handleEnterDepartament(event: Event) {
    event.preventDefault();
    this.addDepartament();
  }

  abaAtiva: 'geral' | 'config' | 'anexos' = 'geral';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.notification.erro('Por favor, selecione um arquivo de imagem (PNG, JPG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.notification.erro('O arquivo é muito grande. O tamanho máximo é 2MB.');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  removerImagem(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

onSubmit() {
  this.request.CNPJ = this.request.CNPJ.replace(/\D/g, '');

  const formData = new FormData();

  formData.append('Name', this.request.Name);
  formData.append('CNPJ', this.request.CNPJ);
  formData.append('Email', this.request.Email);
  formData.append('PostalCode', this.request.PostalCode);
  formData.append('Street', this.request.State);
  formData.append('Number', this.request.Number);
  formData.append('Neighborhood', this.request.Neighborhood);
  formData.append('City', this.request.City);
  formData.append('State', this.request.State);
  formData.append('Country', this.request.Country);
  if (this.request.PhoneNumber) formData.append('PhoneNumber', this.request.PhoneNumber);
  if (this.request.Notes) formData.append('Notes', this.request.Notes);

  this.request.Categories.forEach(cat => formData.append('Categories', cat));
  this.request.Departaments.forEach(dep => formData.append('Departaments', dep));

  for (let i = 0; i < this.request.Slas.length; i++) {
    const sla = this.request.Slas[i];
    formData.append(`Slas[${i}].type`, sla.type.toString());
    formData.append(`Slas[${i}].slaPriority`, sla.slaPriority.toString());
    formData.append(`Slas[${i}].slaInMinutes`, sla.slaInMinutes.toString());
  }

  if (this.selectedFile) {
    formData.append('ProfilePictureUrl', this.selectedFile, this.selectedFile.name);
  }

  this.request.CNPJ = this.request.CNPJ.replace(/\D/g, '');    
    this.organization_services.CreateOrganization(formData)
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
