import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, ComponentFactory, ViewChild, ViewContainerRef, ComponentRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  @ViewChild(PlaceholderDirective) placeHolder;
  private authObservable: Observable<AuthResponseData | string>;
  private alertSub: Subscription;
  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) {}

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
        this.openAlertBox(errorMessage);
      }
    );
    form.reset();
  }

  ngOnDestroy(): void {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
  }

  private openAlertBox(errorMessage: string) {
    const alertComponentFactory: ComponentFactory<AlertComponent> = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const viewContainerRef: ViewContainerRef = this.placeHolder.viewContainerRef;
    viewContainerRef.clear();
    const alertComponentRef: ComponentRef<AlertComponent> = viewContainerRef.createComponent<AlertComponent>(alertComponentFactory);
    alertComponentRef.instance.message = errorMessage;
    this.alertSub = alertComponentRef.instance.closeAlertBox.subscribe(()=> {
      viewContainerRef.clear();
      this.alertSub.unsubscribe();
    });
  }
}
