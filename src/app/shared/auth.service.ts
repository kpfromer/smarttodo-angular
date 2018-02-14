import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';

const url = environment.apiUrl;

interface Token {
  authHeader: string;
}

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) {
  }

  login(username: string, password: string) {
    const loggedIn = new Subject<boolean>();

    this.http.post<Token>(`${url}/authenticate`, {username, password})
      .subscribe(token => {
          if (token.authHeader) {
            localStorage.setItem('id_token', token.authHeader);
            loggedIn.next(true);
          } else {
            loggedIn.next(false);
          }
          loggedIn.complete();
        }, error => {
          if (error.status && error.status === 400) {
            loggedIn.next(false);
          } else {
            loggedIn.error(error);
          }
          loggedIn.complete();
        }
      );
    return loggedIn;
  }

  logout() {
    localStorage.removeItem('id_token');
    return true;
  }

  loggedIn() {
    const token = this.jwtHelperService.tokenGetter();

    if (!token) {
      return false;
    }

    const tokenExpired = this.jwtHelperService.isTokenExpired(token);

    return !tokenExpired;
  }
}
