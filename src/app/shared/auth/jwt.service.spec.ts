import {TestBed} from '@angular/core/testing';

import {JwtService} from './jwt.service';
import {JWT_OPTIONS} from './jwtoptions.token';

describe('JwtService', () => {
  let service: JwtService;

  const options = {
    tokenGetter: () => 'tokenVal',
    headerName: 'headerName',
    authScheme: 'authScheme',
    throwNoTokenError: false,
    skipWhenExpired: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: JWT_OPTIONS,
          useValue: options
        },
        JwtService
      ]
    });
    service = TestBed.get(JwtService);
  });

  beforeEach(() => {

  });

  // TODO: test

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getToken', () => {
    it('should return token', () => {
      expect(typeof service.getToken()).toBe('function');
      expect(service.getToken()()).toBe('tokenVal');
    });
  });

  describe('decodeToken', () => {
    it('should return decoded token', () => {

      // service.isTokenExpired();
      // service.isTokenExpired('token');
      //
      // service.helper.decodeToken.call()
      //
      // expect()

      // expect(service.helper.decodeToken.calls.allArgs()).toEqual(['tokenVal', 'token']);
    });
  });

  describe('getTokenExpirationDate', () => {
    it('should return token\'s expiration date');
  });

  describe('isTokenExpired', () => {
    it('should return true if the token is expired');
    it('should return false if the token is not expired');
  });
});
