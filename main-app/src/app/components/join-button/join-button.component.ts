import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'join-button',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule, RouterLinkActive, RouterLink],
  styleUrl: './join-button.component.sass',
  templateUrl: './join-button.component.html',
})
export class JoinButtonComponent {
  constructor(private modalService: ModalService) {}

  onButtonClick() {
    this.modalService.triggerShowModal();
  }
}
