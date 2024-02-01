import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  // templateUrl: './nav.component.html',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule, RouterLinkActive, RouterLink],
  template: `
    <nav>
    <a class="nav__logo">
      <img
        ngSrc="/assets/logo.svg"
        alt="Code Maestro Logo"
        width="305"
        height="33.44"
      />
    </a>
    <ul class="nav__items">
      <li class="nav__item">
        <a routerLink="/home" routerLinkActive="active">Home</a>
      </li>
      <li class="nav__item">
        <a routerLink="/courses" routerLinkActive="active">Courses</a>
      </li>
      <li class="nav__item">
        <a routerLink="/Community" routerLinkActive="active">Community</a>
      </li>
      <li class="nav__item">
        <a routerLink="/projects" routerLinkActive="active">Projects</a>
      </li>
      <li class="nav__item">
        <a routerLink="/login" routerLinkActive="active">Login</a>
      </li>
      <li class="nav__item">
        <a routerLink="/signup" routerLinkActive="active">Signup</a>
      </li>
    </ul>
  </nav>
  `,
})
export class NavComponent {}
