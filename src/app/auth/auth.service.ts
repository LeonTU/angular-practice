import { Router } from '@angular/router';
import { User } from './user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubject = new BehaviorSubject<User>(null);
  private apiKey: string = 'AIzaSyCRCiJeAw0Jn3jrONTKwTy0E_1__S9bKo8';
  private signUpUrl: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
  private signInUrl: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
  private expirationTimer = null;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.signUpUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    ).pipe(
      tap(this.authenticated),
      catchError(this.catchErrorFunc)
    );
  }

  signIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(this.signInUrl, {
      email: email,
      password: password,
      returnSecureToken: true,
    }).pipe(
      tap(this.authenticated),
      catchError(this.catchErrorFunc),
    );
  }

  logout(): void {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
  }

  autoLogin(): void {
    const userData: {email: string, id: string, _token: string, _tokenExpirationData: string}
      = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const user: User = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationData));
      if (user.token) {
        this.userSubject.next(user);
        const expirationRemaining: number = new Date(userData._tokenExpirationData).getTime() - new Date().getTime();
        this.autoLogout(expirationRemaining);
      }
    }
  }

  autoLogout(expirationDuration: number): void {
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private catchErrorFunc = (errorRes: HttpErrorResponse): Observable<string> => {
    let errorMessage: string;
    switch (errorRes.error?.error?.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exists.';
        break;
      case 'INVALID_EMAIL':
        errorMessage = 'The email format is invalid.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is invalid.';
        break;
      default:
        errorMessage = 'An error occurred.';
    }
    return throwError(errorMessage);
  }

  private authenticated = (data: AuthResponseData): void => {
    const user: User = new User(
      data.email,
      data.localId,
      data.idToken,
      new Date(new Date().getTime() + +data.expiresIn * 1000)
    );
    this.userSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(+data.expiresIn * 1000);
  }
}
