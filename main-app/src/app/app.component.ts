import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'main-app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, HttpClientModule],
  providers: [HttpClientModule],
  template: `
    <app-nav></app-nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
