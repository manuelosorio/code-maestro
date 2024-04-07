import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { NavComponent } from '../components/nav/nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'default-layout',
  standalone: true,
  imports: [NavComponent, RouterOutlet],
  template: `
    <app-nav></app-nav>
    <router-outlet></router-outlet>
  `,
})
export default class DefaultLayout {
  constructor() {
    const routeMeta: RouteMeta = {
      redirectTo: '/courses/git-and-github-simplified',
      pathMatch: 'full',
    };
  }
}
