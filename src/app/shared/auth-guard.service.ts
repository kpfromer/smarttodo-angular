import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(/* todo: private authService: AuthService,*/ private router: Router) {
  }

  canActivate() {
    return false;
    // todo: add authentication (return true if auth else return false)
  }

  canActivateChild() {
    return this.canActivate();
  }

}
