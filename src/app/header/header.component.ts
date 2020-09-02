import { User } from './../auth/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userSub: Subscription;
  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.userSubject.subscribe((user: User) => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.restoreRecipes();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
