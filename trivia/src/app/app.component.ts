import { Component } from '@angular/core';
import firebase from 'firebase/app';
import { firebaseConfig } from './credentials';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trivia';
  //initializeApp(firebase.initializeApp(firebaseConfig));
}
