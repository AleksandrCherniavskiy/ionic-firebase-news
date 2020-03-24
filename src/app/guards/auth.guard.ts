import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertController } from '@ionic/angular';

import { AuthenticationService } from '../../shared/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      this.alertCtrl.create({
        header: 'Access Denied',
        message: 'You are not allowed, check your credentials',
        buttons: ['OK']
      }).then(alert => alert.present());
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
