import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';
import { QuizScreenComponent } from './components/quiz-screen/quiz-screen.component';
import { StatsScreenComponent } from './components/stats-screen/stats-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    QuizScreenComponent,
    StatsScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
