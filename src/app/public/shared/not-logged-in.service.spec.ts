import {inject, TestBed} from '@angular/core/testing';

import {NotLoggedIn} from './not-logged-in.service';
import {AuthService} from '../../shared/auth.service';

describe('NotLoggedIn', () => {

  describe('canActivate', () => {
    beforeEach(() => {
      class MockAuthService {
        loggedIn() {
          return;
        }
      }

      TestBed.configureTestingModule({
        providers: [NotLoggedIn, {provide: AuthService, useClass: MockAuthService}]
      });
    });
    it('should allow access', inject([NotLoggedIn, AuthService],
      (service: NotLoggedIn, authService: AuthService) => {
        spyOn(authService, 'loggedIn').and.returnValue(true);
        expect(service.canActivate()).toBe(false);
      }));
    it('should not allow access if user is logged in', inject([AuthService, NotLoggedIn],
      (authService: AuthService, service: NotLoggedIn) => {
        spyOn(authService, 'loggedIn').and.returnValue(false);
        expect(service.canActivate()).toBe(true);
      }));
  });

  describe('canActivateChild', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [NotLoggedIn]
      });
    });
    it('should call canActivate', inject([NotLoggedIn],
      (service: NotLoggedIn) => {
        spyOn(service, 'canActivate');
        service.canActivateChild();
        expect(service.canActivate).toHaveBeenCalled();
      }));
  });
});
