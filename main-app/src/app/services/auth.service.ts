import {HttpClient, HttpErrorResponse} from '@angular/common/http';
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
      this.authenticated ?? false,
    );
    this.authenticationErrSubject = new Subject();
    this.authenticated$ = this.authenticatedSubject.asObservable();
    this.authenticationErr = this.authenticationErrSubject.asObservable();
    // this.isAuthenticated();
  }
  isAuthenticated() {
    return this.http.get('/api/v1/auth').subscribe((res: any) => {
      console.log(res)
      this.authenticated = res.body.authenticated;
      this.authenticatedSubject.next(this.authenticated);
    });
  }

  signIn(data) {
    return this.http.post('/api/v1/auth/signin', data, {
      withCredentials: true
    });
  }

  signUp(data) {
    return this.http.post('/api/v1/auth/signup', data, {
      withCredentials: true,
    });
  }
}
