import {Inject, Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {JWT_OPTIONS} from './jwtoptions.token';

@Injectable()
export class JwtService {

  helper = new JwtHelperService();

  // TODO: test

  constructor(@Inject(JWT_OPTIONS) private config) {
  }

  getToken(): string {
    // TODO: promises?
    return this.config.tokenGetter();
  }

  decodeToken(token: string = this.getToken()): any {
    return this.helper.decodeToken(token);
  }

  getTokenExpirationDate(token: string = this.getToken()): Date {
    return this.helper.getTokenExpirationDate(token);
  }

  isTokenExpired(token: string = this.getToken()): boolean {
    return this.helper.isTokenExpired(token);
  }
}
