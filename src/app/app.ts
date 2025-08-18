import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { Sidenav } from './layout/sidenav/sidenav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, Sidenav, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   protected title = 'Fixeon';

   isLoginRoute = false;

  constructor(private router: Router) {
     const currentUrl = this.router.url;
    this.isLoginRoute = currentUrl === '/' || currentUrl === '/login';

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginRoute = event.url === '/' || event.urlAfterRedirects === '/';
    });
  }
}
