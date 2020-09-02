import { take } from 'rxjs/operators';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.authService.userSubject.pipe(take(1)).subscribe((user: User) => {
      if (user) {
        req = req.clone({
          //params: req.params.set('auth', user.token)
          setParams: {
            auth: user.token
          }
        })
      }
    });
    return next.handle(req);
  }
}
