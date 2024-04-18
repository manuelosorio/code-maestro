import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated: boolean | undefined;
  private authenticatedSubject: BehaviorSubject<boolean | undefined>;
  public authenticated$: Observable<boolean | undefined>;

  private authenticationErrSubject: Subject<HttpErrorResponse>;
  public authenticationErr: Observable<HttpErrorResponse>;

  constructor(private http: HttpClient) {
    this.authenticatedSubject = new BehaviorSubject<boolean | undefined>(
      this.authenticated,
    );
    this.authenticationErrSubject = new Subject();
    this.authenticated$ = this.authenticatedSubject.asObservable();
    this.authenticationErr = this.authenticationErrSubject.asObservable();
  }

  setAuthStatus(isAuth: boolean) {
    this.authenticatedSubject.next(isAuth);
  }
  isAuthenticated() {
    return this.http.get<{ statusCode: number; authenticated: boolean }>(
      '/api/v1/auth/',
      {
        withCredentials: true,
      },
    );
  }

  signIn(data) {
    return this.http.post('/api/v1/auth/signin', data, {
      withCredentials: true,
    });
  }

  signOut() {
    return this.http
      .delete('/api/v1/auth', {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.authenticatedSubject.next(false);
        },
        error: (err) => {
          console.error(err.message);
        },
      });
  }
  signUp(data) {
    return this.http.post<{
      statusCode: number;
      body: {
        message: string;
      };
    }>('/api/v1/auth/signup', data, {
      withCredentials: true,
    });
  }
}
