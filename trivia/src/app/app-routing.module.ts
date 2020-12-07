import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';
import { QuizScreenComponent } from './components/quiz-screen/quiz-screen.component';
import { StatsScreenComponent } from './components/stats-screen/stats-screen.component';

const routes: Routes = [
  { path: '', component: LoginScreenComponent },
  { path: 'quiz', component: QuizScreenComponent },
  { path: 'stats', component: StatsScreenComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
