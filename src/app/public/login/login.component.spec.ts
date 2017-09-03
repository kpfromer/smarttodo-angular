import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {Directive} from '@angular/core';
import {AuthService} from '../../shared/auth.service';
import {By} from '@angular/platform-browser';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import createSpy = jasmine.createSpy;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockRouter = {
    navigateByUrl: createSpy('navigateByUrl')
  };

  beforeEach(async(() => {

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

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        {provide: Router, useValue: mockRouter},
        {provide: AuthService, useClass: MockAuthService}
      ],
      declarations: [
        LoginComponent,
        MockFlashMessage
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    console.log(component);
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
      spyOn(loginService, 'login').and.returnValue(Promise.resolve(true));

      component.login('test', 'testPassword');
      tick();

      expect(loginService.login).toHaveBeenCalledWith('test', 'testPassword');
    }));

    it('should redirect logged in user to /todo', fakeAsync(() => {
      spyOn(loginService, 'login').and.returnValue(Promise.resolve(true));

      component.login('test', 'testPassword');
      tick();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/todo');
    }));

    it('should display username/password flashmessage user did not successfully login', fakeAsync(() => {
      spyOn(loginService, 'login').and.returnValue(Promise.resolve(false));

      expect(component.notValidUser).toBe(false);

      component.login('test', 'testPassword');
      tick();

      expect(component.notValidUser).toBe(true);
    }));

    it('should reset the form', fakeAsync(() => {
      spyOn(loginService, 'login').and.returnValue(Promise.resolve(false));
      spyOn(component.loginForm, 'reset');

      component.login('test', 'testPassword');
      tick();

      expect(component.loginForm.reset).toHaveBeenCalledWith({username: undefined, password: undefined});
    }));

    it('should be triggered on submit button click with correct values', () => {
      spyOn(component, 'login');

      component.loginForm.setValue({username: 'a cool username', password: 'a cool password'});

      const submit = fixture.debugElement.query(By.css('button[type=submit]'));
      submit.nativeElement.click();
      fixture.detectChanges();

      expect(component.login).toHaveBeenCalledWith('a cool username', 'a cool password');
    });
  });

  describe('view', () => {

    describe('flashmessage', () => {
      it('should be displayed when user\'s credentials is valid', () => {
        component.notValidUser = false;
        fixture.detectChanges();

        const flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
        expect(flashmessage).toBeNull();
      });

      it('should not be displayed when user\'s credentials are invalid', () => {
        component.notValidUser = true;
        fixture.detectChanges();

        const flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
        expect(flashmessage).toBeTruthy();
      });

    });

    describe('validation messages', () => {

      describe('username', () => {
        let usernameInput;
        beforeEach(() => {
          usernameInput = component.loginForm.get('username');
        });

        it('should not display required message when username is filled in', () => {
          component.loginForm.patchValue({username: 'hello'});

          usernameInput.markAsTouched();
          fixture.detectChanges();

          const errorElement = fixture.debugElement.query(By.css('#usernameContainer'))
            .query(By.css('.error'));

          expect(errorElement).toBeNull();
        });

        it('should display required message when username is empty', () => {
          component.loginForm.patchValue({username: ''});

          usernameInput.markAsTouched();
          fixture.detectChanges();

          const errorElement = fixture.debugElement.query(By.css('#usernameContainer'))
            .query(By.css('.error'));

          expect(errorElement).toBeTruthy();
          expect(errorElement.nativeElement.textContent.includes('Username is required')).toBe(true);
        });
      });

      describe('password', () => {
        let passwordInput;
        beforeEach(() => {
          passwordInput = component.loginForm.get('password');
        });

        it('should not display required message when password is filled in', () => {
          component.loginForm.patchValue({password: 'hello'});

          passwordInput.markAsTouched();
          fixture.detectChanges();

          const errorElement = fixture.debugElement.query(By.css('#passwordContainer'))
            .query(By.css('.error'));

          expect(errorElement).toBeNull();
        });

        it('should display required message when there password is empty', () => {
          component.loginForm.patchValue({password: ''});

          passwordInput.markAsTouched();
          fixture.detectChanges();

          const errorElement = fixture.debugElement.query(By.css('#passwordContainer'))
            .query(By.css('.error'));

          expect(errorElement).toBeTruthy();
          expect(errorElement.nativeElement.textContent.includes('Password is required')).toBe(true);
        });
      });
    });

    describe('input', () => {

      describe('username', () => {
        it('should not be valid when user has not interacted with it', () => {
          component.loginForm.patchValue({username: null});
          component.loginForm.get('username').markAsPristine();
          fixture.detectChanges();

          const usernameInputElement = fixture.debugElement.query(By.css('input[name=username]'));

          expect(usernameInputElement.classes.valid).toBe(false);
        });

        it('should be valid when user enters a value', () => {
          component.loginForm.patchValue({username: 'a cool username!'});
          component.loginForm.get('username').markAsDirty();
          fixture.detectChanges();

          const usernameInputElement = fixture.debugElement.query(By.css('input[name=username]'));

          expect(usernameInputElement.classes.valid).toBe(true);
        });

        it('should not be error when user has interacted with it but is valid', () => {
          component.loginForm.patchValue({username: 'valid'});
          component.loginForm.get('username').markAsDirty();
          fixture.detectChanges();

          const usernameInputElement = fixture.debugElement.query(By.css('input[name=username]'));

          expect(usernameInputElement.classes.error).toBe(false);
        });

        it('should be error when user enters an invalid value', () => {
          component.loginForm.patchValue({username: ''});
          component.loginForm.get('username').markAsDirty();
          fixture.detectChanges();

          const usernameInputElement = fixture.debugElement.query(By.css('input[name=username]'));

          expect(usernameInputElement.classes.error).toBe(true);
        });

        it('should not be error when user doesn\'t interact with it', () => {
          component.loginForm.patchValue({username: null});
          component.loginForm.get('username').markAsPristine();
          fixture.detectChanges();

          const usernameInputElement = fixture.debugElement.query(By.css('input[name=username]'));

          expect(usernameInputElement.classes.error).toBe(false);
        });
      });

      describe('password', () => {
        it('should not be valid when user has not interacted with it', () => {
          component.loginForm.patchValue({password: null});
          component.loginForm.get('password').markAsPristine();
          fixture.detectChanges();

          const passwordInputElement = fixture.debugElement.query(By.css('input[name=password]'));

          expect(passwordInputElement.classes.valid).toBe(false);
        });

        it('should be valid when user enters a value', () => {
          component.loginForm.patchValue({password: 'a cool password!'});
          component.loginForm.get('password').markAsDirty();
          fixture.detectChanges();

          const passwordInputElement = fixture.debugElement.query(By.css('input[name=password]'));

          expect(passwordInputElement.classes.valid).toBe(true);
        });

        it('should not be error when user has interacted with it but is valid', () => {
          component.loginForm.patchValue({password: 'valid'});
          component.loginForm.get('password').markAsDirty();
          fixture.detectChanges();

          const passwordInputElement = fixture.debugElement.query(By.css('input[name=password]'));

          expect(passwordInputElement.classes.error).toBe(false);
        });

        it('should be error when user enters an invalid value', () => {
          component.loginForm.patchValue({password: ''});
          component.loginForm.get('password').markAsDirty();
          fixture.detectChanges();

          const passwordInputElement = fixture.debugElement.query(By.css('input[name=password]'));

          expect(passwordInputElement.classes.error).toBe(true);
        });

        it('should not be error when user doesn\'t interact with it', () => {
          component.loginForm.patchValue({password: null});
          component.loginForm.get('password').markAsPristine();
          fixture.detectChanges();

          const passwordInputElement = fixture.debugElement.query(By.css('input[name=password]'));

          expect(passwordInputElement.classes.error).toBe(false);
        });
      });
    });
  });
});
