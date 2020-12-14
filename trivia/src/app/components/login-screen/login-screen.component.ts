import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserStatsService } from 'src/app/services/userStats.service';
import FirestoreRec from 'src/app/services/userStats.service';

interface User {
  emailAddress: string;
  password: string;
}

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {

  public userStats: FirestoreRec;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private userStatsService: UserStatsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
  }

  public user: User = {
    emailAddress: localStorage.emailAddress,
    password: "",
  };

  changedEmailAddress() {
    localStorage.setItem('emailAddress', this.user.emailAddress);
  }
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  password: string = "";
  hide: boolean = true;

  public loading: boolean = false;

  async onLogIn() {
    this.loading = true;
    try {
      await this.authSvc.loginUser(this.user.emailAddress,
                                     this.user.password);

      this.loading = false;
      this.router.navigateByUrl('quiz', { queryParams: { id: this.user.emailAddress } });
      localStorage.setItem('currentUser', this.user.emailAddress);
    } catch (error) {
      this.dialog.open(LogInErrorDialog);
      this.loading = false;
    }
  }

  async createAccount(): Promise<void> {
    this.loading = true;
    try {
      await this.authSvc.signupUser(this.user.emailAddress,
                                    this.user.password);

      await this.userStatsService.create(this.user.emailAddress);

      this.loading = false;
      this.dialog.open(CreateUserSuccessDialog);
    } catch (error) {
      this.dialog.open(CreateUserErrorDialog);
      this.loading = false;
    }
  }

  resetPassword(): void {
    this.authSvc.resetPassword(this.user.emailAddress);
    this.dialog.open(ResetPasswordDialog);
  }

}

@Component({
  selector: 'log-in-error-dialog',
  templateUrl: '../../alerts/log-in-error-dialog.html',
})
export class LogInErrorDialog {}

@Component({
  selector: 'create-user-success-dialog',
  templateUrl: '../../alerts/create-user-success-dialog.html',
})
export class CreateUserSuccessDialog {}

@Component({
  selector: 'create-user-error-dialog',
  templateUrl: '../../alerts/create-user-error-dialog.html',
})
export class CreateUserErrorDialog {}

@Component({
  selector: 'reset-password-dialog',
  templateUrl: '../../alerts/reset-password-dialog.html',
})
export class ResetPasswordDialog {}


