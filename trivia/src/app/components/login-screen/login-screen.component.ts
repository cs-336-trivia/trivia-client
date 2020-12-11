import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public emailAddress: string = localStorage.emailAddress;
  changedEmailAddress() {
    localStorage.setItem('emailAddress', this.emailAddress);
  }
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  password: string = "";
  hide = true;
}
