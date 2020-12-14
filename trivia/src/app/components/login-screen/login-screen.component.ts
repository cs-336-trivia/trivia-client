import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserStatsService } from 'src/app/services/userStats.service';
import FirestoreRec from 'src/app/services/userStats.service';

// This is the user object I use to store the email and password
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

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private userStatsService: UserStatsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  // I create the user object and store the email address locally
  public user: User = {
    emailAddress: localStorage.emailAddress,
    password: "",
  };

  // Changes the email as the user inputs it
  changedEmailAddress() {
    localStorage.setItem('emailAddress', this.user.emailAddress);
  }
  // This is an email form check to make sure you have an @ symbol and a .com
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // Variables for the password
  password: string = "";
  hide: boolean = true;

  // A loading boolean used to display a loading icon if true
  public loading: boolean = false;

  // Called when the user clicks the log in button
  async onLogIn() {
    this.loading = true;
    try {
      // Logs in the user using firebase authentication
      await this.authSvc.loginUser(this.user.emailAddress,
                                     this.user.password);

      this.loading = false;
      // Navigates to the quiz screen
      this.router.navigateByUrl('quiz');
      // Sets the logged in user email address
      localStorage.setItem('currentUser', this.user.emailAddress);
    } catch (error) {
      this.dialog.open(LogInErrorDialog);
      this.loading = false;
    }
  }

  // Called when the user clicks the create account button
  async createAccount(): Promise<void> {
    this.loading = true;
    try {
      // Signs up the user using firebase authentication
      await this.authSvc.signupUser(this.user.emailAddress,
                                    this.user.password);

      // Creates a firebase firestore document for a new user to store their stats
      await this.userStatsService.create(this.user.emailAddress);

      this.loading = false;
      this.dialog.open(CreateUserSuccessDialog);
    } catch (error) {
      this.dialog.open(CreateUserErrorDialog);
      this.loading = false;
    }
  }

  // Sends a reset password link to valid emails
  resetPassword(): void {
    this.authSvc.resetPassword(this.user.emailAddress);
    this.dialog.open(ResetPasswordDialog);
  }

}

// These are components for different alert messages
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


