import { Component } from '@angular/core';
import firebase from 'firebase/app';
import { firebaseConfig } from './credentials';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

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
    public dialog: MatDialog,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    firebase.initializeApp(firebaseConfig);
  }

  public backToQuiz = localStorage.backToQuiz;

  goToQuiz() {
    localStorage.setItem('backToQuiz', 'false');
    this.backToQuiz = localStorage.getItem('backToQuiz');
    this.router.navigateByUrl('quiz');
  }

  goToStats() {
    if(this.router.url === '/quiz' || this.router.url == '/stats') {
      this.router.navigateByUrl('stats');
      localStorage.setItem('backToQuiz', 'true');
      this.backToQuiz = localStorage.getItem('backToQuiz');
    } else {
      this.dialog.open(LogInDialog);
    }
  }

  async logoutUser(): Promise<void> {
    this.authSvc.logoutUser();
    localStorage.setItem('backToQuiz', 'false');
    this.backToQuiz = localStorage.getItem('backToQuiz');
    this.router.navigateByUrl('login');
    if(this.router.url !== '/login') {
      this.dialog.open(LoggedOutDialog);
    }

  }
}

@Component({
  selector: 'log-in-dialog',
  templateUrl: './alerts/log-in-dialog.html',
})
export class LogInDialog {}

@Component({
  selector: 'logged-out-dialog',
  templateUrl: './alerts/logged-out-dialog.html',
})
export class LoggedOutDialog {}