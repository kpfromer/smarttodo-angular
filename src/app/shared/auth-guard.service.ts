import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate() {
    if (this.authService.loggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  canActivateChild() {
    return this.canActivate();
  }

}
