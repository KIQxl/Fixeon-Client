import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-master-management-company',
  imports: [CommonModule],
  templateUrl: './master-management-company.html',
  styleUrl: './master-management-company.css'
})
export class MasterManagementCompany {
  abaAtiva: 'visaoGeral' | 'usuarios' | 'configuracoes' | 'atividade' = 'visaoGeral';

  mudarAba(novaAba: 'visaoGeral' | 'usuarios' | 'configuracoes' | 'atividade') {
    this.abaAtiva = novaAba;
  }

  isEditing = false;

  ToggleEdit(){
    this.isEditing = !this.isEditing;
  }
}
