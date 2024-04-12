import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule, RouterLinkActive, RouterLink,
    HttpClientModule],
  styleUrls: ['./nav.component.sass'],
  templateUrl: './nav.component.html',
})
export class NavComponent {}
