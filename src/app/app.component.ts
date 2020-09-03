import { User } from './auth/user.model';
import { AuthService } from './auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-first-app';

  constructor(private authService: AuthService) {
    const user: User = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      console.log('true')
      console.log(user)
    } else {
      console.log('false')
    }
    this.authService.userSubject.next(user);
  }
}
