import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Footer } from './core/components/footer/footer';
import { Header } from './core/components/header/header';
import { Sidenav } from './core/components/sidenav/sidenav';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, Sidenav, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   protected title = 'Fixeon';

   isLoginRoute = false;
   isSidebarCollapsed = true;

  constructor(private router: Router, private location: Location,) {
    const currentUrl = this.router.url;
    this.isLoginRoute = currentUrl === '/' || currentUrl === '/login';

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginRoute = event.url === '/' || event.urlAfterRedirects === '/';
    });
  }

  voltar(): void {
    // Se há histórico anterior no navegador, volta
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Se foi acesso direto (sem histórico anterior), define rota padrão
      this.router.navigate(['/home']); 
    }
  }
}