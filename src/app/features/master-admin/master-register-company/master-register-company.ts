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

  onSubmitForm() {
    // Cria uma instância de FormData
    const formData = new FormData();

    // Adiciona todos os campos de texto do seu objeto 'request'
    formData.append('Name', this.request.Name);
    formData.append('CNPJ', this.request.CNPJ.replace(/\D/g, '')); // Limpa a máscara
    formData.append('Email', this.request.Email);
    formData.append('PhoneNumber', this.request.PhoneNumber);
    formData.append('Street', this.request.Street);
    formData.append('Number', this.request.Number);
    formData.append('Neighborhood', this.request.Neighborhood);
    formData.append('City', this.request.City);
    formData.append('State', this.request.State);
    formData.append('PostalCode', this.request.PostalCode.replace(/\D/g, ''));
    formData.append('Country', this.request.Country);

    // Adiciona o arquivo de imagem, se ele foi selecionado
    if (this.selectedFile) {
      // O nome 'ProfilePicture' deve corresponder exatamente ao nome da propriedade no seu DTO do backend
      formData.append('ProfilePicture', this.selectedFile, this.selectedFile.name);
    }

    // Envia o FormData para o serviço
    this.company_services.CreateCompany(formData) // <-- ATENÇÃO: seu serviço agora precisa aceitar FormData
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.notification.sucesso("Empresa Cadastrada.");
            this.router.navigate(['/master-list-companies']);
          } else {
            this.notification.erro(res.errors);
          }
        },
        error: (err) => {
          // Lógica de tratamento de erro
          this.notification.erro(err?.error?.errors || "Ocorreu um erro inesperado.");
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
      this.notification.erro('Por favor, selecione um arquivo de imagem.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
      this.notification.erro('O arquivo é muito grande (máx 2MB).');
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
}
