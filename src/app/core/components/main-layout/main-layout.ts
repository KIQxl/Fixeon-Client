import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidenav } from '../sidenav/sidenav';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Footer, Header, Sidenav, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  isSidebarCollapsed = true; // Apenas a lógica da UI permanece

  constructor(private router: Router, private location: Location) {
  }

  voltar(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/workspace/dashboard']);
    }
  }
}
