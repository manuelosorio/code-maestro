import { Component, signal, WritableSignal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'main-app-signup',
  template: `
    <div class="container">
      <h2>Sign Up</h2>
      @if (successMessage && successMessage.length > 0) {
        <p class="status status--success">{{ successMessage }}</p>
      }
      @if (errorMessage && errorMessage.length > 0) {
        <p class="status status--error">{{ errorMessage }}</p>
      }
      <form [formGroup]="signupForm" (submit)="onSubmit()">
        <div class="grid">
          <div class="form-group column--12">
            <label for="name">Name</label>
            <input type="text" id="name" formControlName="name" />
          </div>
          <div class="form-group column--12">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" />
          </div>
          <div class="form-group column--12">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" />
          </div>
          <div class="grid cta-row column--12">
            <button
              type="submit"
              [disabled]="signupForm.invalid"
              class="button__primary column--12 column__md--4"
            >
              Sign Up
            </button>
            <div class="column--12 column__md--8 auth-group grid">
              <p class="column--12">
                Have an account? <a routerLink="/auth/signin">Sign In</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
})
export default class SignUpPage {
  signupForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.authService.signUp(this.signupForm.value).subscribe({
      next: (res) => {
        if (res.statusCode == 201) {
          this.errorMessage = '';
          this.successMessage = 'Successfully created a new user';
          this.signupForm.reset();
          setTimeout(() => {
            this.successMessage = '';
          }, 1000);
        }
      },
      error: (err) => {
        console.log(err);
        if (err.status == 409) {
          this.successMessage = '';
          this.errorMessage = 'User already exists';
          console.log(this.errorMessage);
        }
      },
    });
  }
}
