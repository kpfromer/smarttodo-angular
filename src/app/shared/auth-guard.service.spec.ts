import {inject, TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth-guard.service';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

describe('AuthGuard', () => {
  beforeEach(() => {

    class MockAuthService {
      loggedIn() {
        return;
      }
    }

    TestBed.configureTestingModule({
      providers: [AuthGuard, {provide: AuthService, useClass: MockAuthService}],
      imports: [RouterTestingModule]
    });
  });

  it('should be created', inject([AuthGuard], (service: AuthGuard) => {
    expect(service).toBeTruthy();
  }));

  describe('canActivate', () => {
    it('should return true if the user is authenticated', inject([AuthGuard, AuthService],
      (service: AuthGuard, authService: AuthService) => {
        spyOn(authService, 'loggedIn').and.returnValue(true);

        expect(service.canActivate()).toBe(true);
      }));

    it('should redirect to the login page if user is not authenticated', inject([AuthGuard, AuthService, Router],
      (service: AuthGuard, authService: AuthService, router: Router) => {
        spyOn(authService, 'loggedIn').and.returnValue(false);
        spyOn(router, 'navigateByUrl');

        expect(service.canActivate()).toBe(false);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
      }));
  });

  describe('canActivateChild', () => {
    it('should call canActivate', inject([AuthGuard],
      (service: AuthGuard) => {
        spyOn(service, 'canActivate');
        service.canActivateChild();
        expect(service.canActivate).toHaveBeenCalled();
      }));
  });
});
