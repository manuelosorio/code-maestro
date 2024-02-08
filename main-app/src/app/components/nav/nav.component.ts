import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule, RouterLinkActive, RouterLink],
  styleUrl: './nav.component.sass',
  templateUrl: './nav.component.html',
})
export class NavComponent {}
