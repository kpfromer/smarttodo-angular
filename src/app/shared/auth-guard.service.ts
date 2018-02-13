import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, CanLoad, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService, private router: Router) {
  }

  checkLogin() {
    if (this.authService.loggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  canActivate() {
    return this.checkLogin();
  }

  canActivateChild() {
    return this.checkLogin();
  }

  canLoad() {
    return this.checkLogin();
  }

}
