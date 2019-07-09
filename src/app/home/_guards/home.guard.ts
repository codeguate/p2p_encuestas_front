import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
providedIn: 'root',
})
export class HomeGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (localStorage.getItem('currentUser')) {
        this.router.navigate(['./../dashboard/home']);
      }

      if (!localStorage.getItem('currentUser')) {
        return true;
      }

          // not logged in so redirect to login page with the return url




    }
}
