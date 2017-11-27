import {TestBed} from '@angular/core/testing';
import {AuthService} from './auth.service';
import 'rxjs/add/observable/of';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {JwtHelperService} from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';

const url = environment.apiUrl;

class MockJwtService {
  isTokenExpired() {
  }

  tokenGetter() {
  }
}

describe('AuthService', () => {

  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {provide: JwtHelperService, useClass: MockJwtService}
      ]
    });
    authService = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login', () => {

    let validResponse;

    let http: HttpTestingController;

    beforeEach(() => {
      validResponse = {
        authHeader: 'i am a token!'
      };

      http = TestBed.get(HttpTestingController);
      spyOn(localStorage, 'setItem');
    });

    afterEach(() => {
      http.verify();
    });

    it('should use /authenticate', () => {
      authService.login('admin', 'secret');

      http.expectOne(`${url}/authenticate`).flush(validResponse);
    });

    it('should post', () => {
      authService.login('admin', 'secret');

      const req = http.expectOne(`${url}/authenticate`);
      expect(req.request.method).toBe('POST');
    });

    it('should set id_token', () => {
      authService.login('admin', 'secret').subscribe(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('id_token', 'i am a token!');
      });

      http.expectOne(`${url}/authenticate`).flush(validResponse);
    });

    it('should return true when successful', () => {
      authService.login('admin', 'secret').subscribe(value => {
        expect(value).toBe(true);
      });

      http.expectOne(`${url}/authenticate`).flush(validResponse);
    });

    it('should return false when username/password are not found', () => {
      authService.login('admin', 'secret').subscribe(value => {
        expect(value).toBe(false);
      });

      http.expectOne(`${url}/authenticate`).flush({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid Email or Password.'
      }, {
        status: 400,
        statusText: 'Invalid Email or Password.'
      });
    });

    it('should return false when there is no token found', () => {
      authService.login('admin', 'secret').subscribe(value => {
        expect(value).toBe(false);
        expect(localStorage.setItem).not.toHaveBeenCalled();
      });

      http.expectOne(`${url}/authenticate`).flush({});
    });
  });

  describe('logout', () => {
    it('should logout', () => {
      spyOn(localStorage, 'removeItem');
      authService.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('id_token');
    });
  });

  describe('loggedIn', () => {
    let service: JwtHelperService;

    beforeEach(() => {
      service = TestBed.get(JwtHelperService);
    });

    it('should return false when no token is found', () => {
      spyOn(service, 'tokenGetter').and.returnValue(undefined);

      const loggedIn = authService.loggedIn();

      expect(loggedIn).toBe(false);
    });
    it('should return false when the token is expired', () => {
      spyOn(service, 'tokenGetter').and.returnValue('I am expired!');
      spyOn(service, 'isTokenExpired').and.returnValue(true);

      const loggedIn = authService.loggedIn();

      expect(loggedIn).toBe(false);
    });
    it('should return true when the token is valid', () => {
      spyOn(service, 'tokenGetter').and.returnValue('I am not expired!');
      spyOn(service, 'isTokenExpired').and.returnValue(false);

      const loggedIn = authService.loggedIn();

      expect(loggedIn).toBe(true);
    });
  });
});
