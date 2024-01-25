import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'main-app-home',
  standalone: true,
  imports: [AnalogWelcomeComponent],
  template: ` <main-app-analog-welcome /> `,
})
export default class HomeComponent {}
