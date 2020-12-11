import { Component } from '@angular/core';
import firebase from 'firebase/app';
import { firebaseConfig } from './credentials';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trivia';

  constructor(
    private authSvc: AuthService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    firebase.initializeApp(firebaseConfig);
  }

  async logoutUser(): Promise<void> {
    this.authSvc.logoutUser();
    this.router.navigateByUrl('login');
  }
}
