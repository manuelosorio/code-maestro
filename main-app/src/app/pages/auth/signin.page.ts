import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink, RouterModule} from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";

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
    <h1>Sign In Page works</h1>
    <form [formGroup]="loginForm" (submit)="onSubmit()">
      <div class="grid">
        <div class="form-group column--12">
          <label for="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            formControlName="email"
          />
        </div>
        <div class="form-group column--12">
          <label for="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            formControlName="password"
          />
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
  `,
})
export default class SignInPage {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  onSubmit() {
    this.authService.signIn(this.loginForm.value).subscribe(res => {
      console.log(res)
    })

  }

}
