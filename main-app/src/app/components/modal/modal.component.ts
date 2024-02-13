import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.sass',
  providers: [FormBuilder],
})
export class ModalComponent implements OnInit {
  public modalForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.email, Validators.required]],
      address: ['', [Validators.required]],
      zipCode: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      expirationDate: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }

  ngOnInit(): void {}
  close(): void {
    console.log('close');
  }
  open(): void {
    console.log('open');
  }

  get name() {
    return this.modalForm.get('name');
  }
  get email() {
    return this.modalForm.get('email');
  }
  get address() {
    return this.modalForm.get('address');
  }
  get zipCode() {
    return this.modalForm.get('zipCode');
  }
  get cardNumber() {
    return this.modalForm.get('cardNumber');
  }
  get expirationDate() {
    return this.modalForm.get('expirationDate');
  }
  get cvv() {
    return this.modalForm.get('cvv');
  }
}
