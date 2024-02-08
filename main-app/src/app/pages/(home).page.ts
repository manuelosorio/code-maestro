import { Component } from '@angular/core';
import { NavComponent } from '../components/nav/nav.component';

@Component({
  selector: 'main-app-home',
  standalone: true,
  imports: [NavComponent],
  template: ` <app-nav></app-nav> `,
})
export default class HomeComponent {}
