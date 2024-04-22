import { Component, ElementRef, input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    HttpClientModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.sass',
  providers: [FormBuilder],
})
export class ModalComponent implements OnInit {
  public slug = input<string>();
  public modalForm: FormGroup;
  public errorMessage = '';
  public successMessage = '';
  @ViewChild('modal') modal?: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private httpClient: HttpClient,
  ) {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.email, Validators.required]],
    });
  }

  ngOnInit(): void {
    this.modalService.showModal$.subscribe(() => {
      this.open();
    });
  }

  open(): void {
    if (this.modal) {
      this.modal.nativeElement.showModal();
    }
  }
  close(): void {
    if (this.modal) {
      this.errorMessage = '';
      this.successMessage = '';
      this.modal.nativeElement.close();
    }
  }
  get name() {
    return this.modalForm.get('name');
  }
  get email() {
    return this.modalForm.get('email');
  }
  subscribe() {
    if (!this.slug()) {
      this.errorMessage = 'Mail list not found';
      return;
    }
    this.httpClient
      .post(`/api/v1/mail-list/${this.slug()}/subscribe`, this.modalForm.value)
      .subscribe({
        next: (res: any) => {
          this.errorMessage = '';
          this.successMessage = res.message;
          this.modalForm.reset();
          setTimeout(() => {
            this.close();
          }, 1500);
        },
        error: (err) => {
          switch (err.status) {
            case 404:
              this.errorMessage = 'Mail list not found';
              break;
            case 400:
              this.errorMessage = err.error.message;
              break;
            default:
              this.errorMessage = 'An error occurred. Please try again later.';
          }
        },
      });
  }
}
