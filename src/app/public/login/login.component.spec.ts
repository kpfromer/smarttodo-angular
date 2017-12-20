import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {Directive} from '@angular/core';
import {AuthService} from '../../shared/auth.service';
import {By} from '@angular/platform-browser';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {MatButtonModule, MatInputModule, MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import createSpy = jasmine.createSpy;

@Directive({
  selector: 'app-flash-message'
})
class MockFlashMessage {
}

class MockAuthService {
  login(username: string, password: string) {
    return;
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockRouter = {
    navigateByUrl: createSpy('navigateByUrl')
  };

  const mockSnackbar = {
    open: createSpy('open')
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        FormBuilder,
        {provide: Router, useValue: mockRouter},
        {provide: AuthService, useClass: MockAuthService},
        {provide: MatSnackBar, useValue: mockSnackbar}
      ],
      declarations: [
        LoginComponent,
        MockFlashMessage
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {

    let loginService: AuthService;

    beforeEach(() => {
      loginService = TestBed.get(AuthService);

      spyOnProperty(component.loginForm, 'invalid', 'get').and.returnValue(false);

      fixture.detectChanges();
    });

    it('should login the user', fakeAsync(() => {
      spyOn(loginService, 'login').and.returnValue(Observable.of(true));

      component.loginForm.setValue({username: 'test', password: 'testPassword'});

      component.login();
      tick();

      expect(loginService.login).toHaveBeenCalledWith('test', 'testPassword');
    }));

    it('should redirect logged in user to /todo', fakeAsync(() => {
      spyOn(loginService, 'login').and.returnValue(Observable.of(true));

      component.loginForm.setValue({username: 'test', password: 'testPassword'});

      component.login();
      tick();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo');
    }));

    it('should display username/password flashmessage user did not successfully login', fakeAsync(() => {
      spyOn(loginService, 'login').and.returnValue(Observable.of(false));

      expect(component.notValidUser).toBe(false);

      component.loginForm.setValue({username: 'test', password: 'testPassword'});

      component.login();
      tick();

      expect(component.notValidUser).toBe(true);
    }));

    it('should reset the form', fakeAsync(() => {
      spyOn(loginService, 'login').and.returnValue(Observable.of(false));
      spyOn(component.loginForm.get('password'), 'reset');

      spyOn(component.loginForm.get('username'), 'setErrors');
      spyOn(component.loginForm.get('password'), 'setErrors');

      component.loginForm.setValue({username: 'test', password: 'testPassword'});

      component.login();
      tick();

      expect(component.loginForm.get('password').reset).toHaveBeenCalled();
      expect(component.loginForm.get('username').setErrors).toHaveBeenCalledWith(null);
      expect(component.loginForm.get('password').setErrors).toHaveBeenCalledWith({required: true});
    }));

    it('should be triggered on submit button click with correct values', () => {
      spyOn(component, 'login');

      component.loginForm.setValue({username: 'a cool username', password: 'a cool password'});

      const submit = fixture.debugElement.query(By.css('button[type=submit]'));
      submit.nativeElement.click();
      fixture.detectChanges();

      expect(component.login).toHaveBeenCalled();
    });

    it('should not be called if validation errors', () => {
      spyOn(component, 'login');

      component.loginForm.setValue({username: '', password: ''});

      const submit = fixture.debugElement.query(By.css('button[type=submit]'));
      submit.nativeElement.click();
      fixture.detectChanges();

      expect(component.login).not.toHaveBeenCalled();
    });

    it('should return false if the form is invalid', fakeAsync(() => {
      component.loginForm.setValue({username: '', password: ''});

      const loggedIn = component.login();
      tick();

      expect(loggedIn).toBe(false);
    }));
  });

  describe('view', () => {

    describe('flashmessage', () => {
      const getFlashmessage = () => fixture.debugElement.query(By.css('app-flash-message'));
      it('should be displayed when user\'s credentials is valid', () => {
        component.notValidUser = false;
        fixture.detectChanges();

        const flashmessage = getFlashmessage();
        expect(flashmessage).toBeNull();
      });

      it('should not be displayed when user\'s credentials are invalid', () => {
        component.notValidUser = true;
        fixture.detectChanges();

        const flashmessage = getFlashmessage();
        expect(flashmessage).toBeTruthy();
      });

    });

    describe('validation messages', () => {

      describe('username', () => {

        const getUsernameContainer = () => fixture.debugElement.query(By.css('#usernameContainer'));
        const getUsernameError = () => getUsernameContainer().query(By.css('mat-error'));

        let usernameInput;
        beforeEach(() => {
          usernameInput = component.loginForm.get('username');
        });

        it('should not display required message when username is filled in', () => {
          component.loginForm.patchValue({username: 'hello'});

          usernameInput.markAsTouched();
          fixture.detectChanges();

          const errorElement = getUsernameError();

          expect(errorElement).toBeNull();
        });

        it('should display required message when username is empty', () => {
          component.loginForm.patchValue({username: ''});

          usernameInput.markAsTouched();
          fixture.detectChanges();

          const errorElement = getUsernameError();

          expect(errorElement).toBeTruthy();
          expect(errorElement.nativeElement.textContent.includes('Username is required')).toBe(true);
        });
      });

      describe('password', () => {

        const getPasswordContainer = () => fixture.debugElement.query(By.css('#passwordContainer'));
        const getPasswordError = () => getPasswordContainer().query(By.css('mat-error'));

        let passwordInput;
        beforeEach(() => {
          passwordInput = component.loginForm.get('password');
        });

        it('should not display required message when password is filled in', () => {
          component.loginForm.patchValue({password: 'hello'});

          passwordInput.markAsTouched();
          fixture.detectChanges();

          const errorElement = getPasswordError();

          expect(errorElement).toBeNull();
        });

        it('should display required message when there password is empty', () => {
          component.loginForm.patchValue({password: ''});

          passwordInput.markAsTouched();
          fixture.detectChanges();

          const errorElement = getPasswordError();

          expect(errorElement).toBeTruthy();
          expect(errorElement.nativeElement.textContent.includes('Password is required')).toBe(true);
        });
      });
    });

    describe('openSnackBar', () => {
      let snackbar: MatSnackBar;

      beforeEach(() => {
        snackbar = TestBed.get(MatSnackBar);
      });

      it('should create a snackbar with custom message, action and time of 3500ms', () => {
        component.openSnackBar('Message', 'ACTION');

        expect(snackbar.open).toHaveBeenCalledWith('Message', 'ACTION', {
          duration: 3500
        });
      });

      it('should return a snackbar', () => {
        mockSnackbar.open.and.returnValue({} as MatSnackBarRef<SimpleSnackBar>);
        const snackbarItem = component.openSnackBar('Message', 'ACTION');

        expect(snackbarItem).toBeTruthy();
      });
    });
  });
});
