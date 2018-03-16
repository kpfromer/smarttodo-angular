import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {JwtService} from './auth/jwt.service';

interface Token {
  authHeader: string;
}

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private jwtService: JwtService) {
  }

  login(username: string, password: string) {
    const loggedIn = new Subject<boolean>();

    this.http.post<Token>(`/login`, {email: username, password})
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
    // TODO: log out server side
    localStorage.removeItem('id_token');
    return true;
  }

  loggedIn() {
    // TODO: fix to rely on auth service
    const token = this.jwtService.getToken();

    if (!token) {
      return false;
    }

    const tokenExpired = this.jwtService.isTokenExpired(token);

    return !tokenExpired;
  }
}
