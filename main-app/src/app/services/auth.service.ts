import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { JSONRPC2 } from '@trpc/server/rpc';
import ErrorResponse = JSONRPC2.ErrorResponse;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated: boolean;
  private authenticatedSubject: BehaviorSubject<boolean>;
  public authenticated$: Observable<boolean>;

  private authenticationErrSubject: Subject<ErrorResponse>;
  public authenticationErr: Observable<ErrorResponse>;

  constructor(private http: HttpClient) {
    this.authenticatedSubject = new BehaviorSubject<boolean>(
      this.authenticated ?? false,
    );
    this.authenticationErrSubject = new Subject();
    this.authenticated$ = this.authenticatedSubject.asObservable();
    this.authenticationErr = this.authenticationErrSubject.asObservable();
    this.isAuthenticated();
  }
  isAuthenticated() {
    return this.http.get('/api/auth').subscribe((res) => {
      this.authenticated = res.authenticated;
      this.authenticatedSubject.next(this.authenticated);
    });
  }

  signIn() {
    return this.http.post('/api/auth/signin', {
      withCredentials: true,
    });
  }

  signUp() {
    return this.http.post('/api/auth/signup', {
      withCredentials: true,
    });
  }
}
