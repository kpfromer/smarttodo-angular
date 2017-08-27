import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild} from '@angular/router';
import {AuthService} from '../../shared/auth.service';

@Injectable()
export class NotLoggedIn implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService) { }

  canActivate() {
    return !this.authService.loggedIn();
  }

  canActivateChild() {
    return this.canActivate();
  }

}
