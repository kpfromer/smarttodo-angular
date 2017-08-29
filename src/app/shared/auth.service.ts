import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import {environment} from '../../environments/environment';
import * as _ from 'lodash';

@Injectable()
export class AuthService {

  constructor(private _http: Http) {
  }

  login(username: string, password: string) {

    return new Promise((resolve, reject) => {
      const url = environment.apiUrl;

      this._http.post(`https://${url}/authenticate`, {username, password})
        .map(res => res.json())
        .subscribe(
          base => {
            const token  = _.get(base, 'data.id_token');
            const error = _.get(base, 'error');
            if (error || !token) return resolve(false);
            localStorage.setItem('id_token', base.data.id_token);
            return resolve(true);
          },
          error => reject(error)
        );
    });

  }

  logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }
}
