import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'code-maestro-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule   ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.sass',
  providers: [FormBuilder]
})
export class ModalComponent implements OnInit {

  public modalForm: FormGroup;
  constructor(private formBuilder: FormBuilder
  ) {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Type('string')]],
      email: ['', [Validators.email, Validators.required, Type('string')]],
      address: ['', [Validators.required, Type('string')]],
      zipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Type('number')]],
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16), Type('number')]],
      expirationDate: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Type('string')]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Type('number')]],
    });
  }

  ngOnInit(): void {


  }
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
