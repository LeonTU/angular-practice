import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  private authObservable: Observable<AuthResponseData | string>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const email: string = form.value.email;
    const password: string = form.value.password;
    this.authObservable = this.isLoginMode ?
      this.authService.signIn(email, password) : this.authService.signUp(email, password);

    this.authObservable.subscribe(
      (response: AuthResponseData) => {
        this.isLoading = false;
        this.router.navigate(['']);
      },
      (errorMessage: string) => {
        this.isLoading = false;
        this.error = errorMessage;
      }
    );
    form.reset();
  }
}
