import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor (
    private router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
                                                Observable<boolean> | Promise<boolean> | boolean {
  return new Promise((resolve, reject) => {
  	firebase.auth().onAuthStateChanged((user: firebase.User) => {
    	  if (user) {
      	  resolve(true);
    	  } else {
      	  this.router.navigateByUrl('');
      	resolve(false);
    	  }
  	  });
    });
  }

}
