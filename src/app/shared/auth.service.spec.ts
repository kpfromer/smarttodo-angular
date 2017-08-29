import {TestBed} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {BaseRequestOptions, Http, HttpModule, RequestMethod, Response, ResponseOptions} from '@angular/http';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';

describe('AuthService', () => {

  let authService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        },
        MockBackend,
        BaseRequestOptions,
        AuthService
      ]
    });
    authService = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login', () => {

    let validResponse;

    let mockBackend;

    beforeEach(() => {
      validResponse = new Response(new ResponseOptions({
        body: JSON.stringify({
          data: {
            id_token: 'i am a token!'
          }
        })
      }));

      mockBackend = TestBed.get(MockBackend);
      spyOn(localStorage, 'setItem').and.returnValue(undefined);
    });

    it('should use /authenticate', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.endsWith('/authenticate')).toBe(true);
        connection.mockRespond(validResponse);
      });
      authService.login('admin', 'secret');
    });

    it('should post', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Post);
        connection.mockRespond(validResponse);
      });
      authService.login('admin', 'secret');
    });

    it('should set id_token', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(validResponse);
      });
      authService.login('admin', 'secret').then(value => {
        expect(localStorage.setItem).toHaveBeenCalledWith('id_token', 'i am a token!');
        done();
      });
    });

    it('should use only https', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.startsWith('https://')).toBe(true);
        connection.mockRespond(validResponse);
      });
      authService.login('admin', 'secret');
    });

    it('should return true when successful', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(validResponse);
      });
      authService.login('admin', 'secret').then(value => {
        expect(value).toBe(true);
        done();
      });
    });

    it('should return false when username/password are not found', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify({
            error: {
              code: 404,
              message: 'Username/Password not found',
            }
          })
        })));
      });
      authService.login('admin', 'secret').then(value => {
        expect(value).toBe(false);
        done();
      });
    });

    it('should return false when there is no token found', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify({})
        })));
      });
      spyOn(_, 'get');
      authService.login('admin', 'secret').then(value => {
        expect(value).toBe(false);
        expect(_.get).toHaveBeenCalledWith({}, 'data.id_token');
        expect(localStorage.setItem).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('logout', () => {
    it('should logout', () => {
      spyOn(localStorage, 'removeItem');
      authService.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('id_token');
    });
  });
});
