import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import * as _ from 'lodash';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';
import {Data} from '@angular/router';
import {Subject} from 'rxjs/Subject';

const url = environment.apiUrl;

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) {
  }

  login(username: string, password: string) {
    const subject = new Subject<boolean>();

    this.http.post<Data>(`${url}/authenticate`, {username, password})
      .subscribe(
        base => {
          const token = _.get(base, 'data.id_token');
          const error = _.get(base, 'error');
          if (error || !token) {
            subject.next(false);
          } else {
            localStorage.setItem('id_token', base.data.id_token);
            subject.next(true);
          }
          subject.complete();
        },
        error => {
          subject.error(error);
          subject.complete();
        }
      );
    return subject;
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('id_token');
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
