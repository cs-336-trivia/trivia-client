import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
//import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
  ) { }

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
  public alertShow: boolean = false;
  public createdUserAlert: boolean = false;

  closeAlert() {
    this.alertShow = false;
  }

  closeCreatedUserAlert() {
    this.createdUserAlert = false;
  }

  async onSubmit() {
    this.loading = true;
    try {
      await this.authSvc.loginUser(this.user.emailAddress,
                                     this.user.password);
      this.loading = false;
      this.router.navigateByUrl('quiz');
    } catch (error) {
      this.loading = false;
      this.alertShow = true;
    }
  }

  async createAccount(): Promise<void> {
    this.loading = true;
    try {
      await this.authSvc.signupUser(this.user.emailAddress,
                                    this.user.password);
      this.loading = false;
      this.createdUserAlert = true;
    } catch (error) {
      this.loading = false;
      this.alertShow = true;
    }
  }

  resetPassword(): void {
    if (!this.user.emailAddress) {
      return; // put up an alert or something.
    }
    this.authSvc.resetPassword(this.user.emailAddress);
  }

}


