import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  CanDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router) {
  }
  canDeactivate(component: CanComponentDeactivate, 
    currentRoute: ActivatedRouteSnapshot, 
    currentState: RouterStateSnapshot, 
    nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return component.CanDeactivate();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('token') != null)
      return true;
    else {
      this.router.navigate(['Login']);
      return false;
    }

  }
}