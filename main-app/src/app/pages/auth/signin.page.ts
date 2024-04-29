import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'main-app-signin',
  styles: `
    .grid {
      width: 80%;
      max-width: 800px;
      margin: auto;
    }
    .grid .grid {
      width: 100%;
      max-width: unset;
    }
  `,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    RouterModule,
  ],
  providers: [FormBuilder],
  template: `
    <div class="container">
      <h2>Sign In</h2>
      @if (successMessage && successMessage.length > 0) {
        <p class="status status--success">{{ successMessage }}</p>
      }
      @if (errorMessage && errorMessage.length > 0) {
        <p class="status status--error">{{ errorMessage }}</p>
      }
      <form [formGroup]="loginForm" (submit)="onSubmit()">
        <div class="grid">
          <div class="form-group column--12">
            <label for="email"> Email </label>
            <input type="email" id="email" formControlName="email" />
          </div>
          <div class="form-group column--12">
            <label for="password"> Password </label>
            <input type="password" id="password" formControlName="password" />
          </div>
          <div class="grid cta-row column--12">
            <button
              type="submit"
              [disabled]="loginForm.invalid"
              class="button__primary column--12 column__md--4"
            >
              Sign In
            </button>
            <div class="column--12 column__md--8 auth-group grid">
              <p class="column--12">
                Need an account? <a routerLink="/auth/signup">Sign Up</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
})
export default class SignInPage {
  loginForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.authService.signIn(this.loginForm.value).subscribe({
      next: () => {
        this.successMessage = 'Successfully logged in';
        this.loginForm.reset();
        this.authService.setAuthStatus(true);
        setTimeout(async () => {
          this.successMessage = '';
          await this.router
            .navigate(['/courses/git-and-github-simplified'])
            .then(() => {
              window.location.reload();
            });
        }, 1000);
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Email or password incorrect.';
        } else {
          this.errorMessage = 'Unknown Error, Try again';
        }
      },
    });
  }
}
