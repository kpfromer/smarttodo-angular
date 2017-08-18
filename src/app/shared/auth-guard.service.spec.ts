import {inject, TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth-guard.service';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
      imports: [RouterTestingModule]
    });
  });

  it('should be created', inject([AuthGuard, Router], (service: AuthGuard, router: Router) => {
    expect(service).toBeTruthy();
  }));

  describe('canActivate', () => {
    it('should return true if the user is authenticated', inject([AuthGuard, Router], (service: AuthGuard, router: Router) => {
      // todo: add authentication system

      expect(service.canActivate()).toBe(true);
    }));

    it('should redirect to the login page if user is not authenticated', inject([AuthGuard, Router],
      (service: AuthGuard, router: Router) => {
        // todo: add authentication system

        spyOn(router, 'navigate');

        expect(service.canActivate()).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['login']);
      }));
  });
});
