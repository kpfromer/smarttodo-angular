import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatMenuTrigger,
  MatSidenavModule,
  MatSnackBar,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AuthService} from './shared/auth.service';
import {Router} from '@angular/router';
import {Component, DebugElement} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {Subject} from 'rxjs/Subject';
import {Location} from '@angular/common';

@Component({
  template: ''
})
class DummyComponent {
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const mockAuthService = {
    loggedIn: () => {
    },
    logout: () => {
    }
  };

  const mockSnackbar = {
    open: () => {
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'login', component: DummyComponent}
        ]),
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatMenuModule
      ],
      declarations: [
        AppComponent,
        DummyComponent
      ],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        {provide: MatSnackBar, useValue: mockSnackbar}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    component.isDark = false;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should use dark theme', () => {
    component.isDark = true;

    fixture.detectChanges();

    const mainElement = fixture.debugElement.query(By.css('.app-frame'));

    expect(mainElement.classes['dark-theme']).toBe(true);
  });

  describe('isDark', () => {
    let overlayContainer: OverlayContainer;

    beforeEach(() => {
      overlayContainer = TestBed.get(OverlayContainer);
    });

    it('should add dark theme class to overlays', () => {
      component.isDark = true;

      expect(overlayContainer.getContainerElement().classList.contains('dark-theme')).toBe(true);
    });

    it('should remove dark theme class from overlays', () => {
      component.isDark = true;
      component.isDark = false;

      expect(overlayContainer.getContainerElement().classList.contains('dark-theme')).toBe(false);
    });

    afterEach(() => {
      overlayContainer.ngOnDestroy();
    });
  });

  describe('menu', () => {

    beforeEach(() => {
      const menuTriggerElement = fixture.debugElement.query(By.directive(MatMenuTrigger));
      menuTriggerElement.nativeElement.click();
      fixture.detectChanges();
    });

    it('should have a button that toggles the theme', () => {
      const toggleElement = fixture.debugElement.query(By.css('#theme-toggle'));

      toggleElement.nativeElement.click();

      expect(toggleElement).toBeTruthy();
      expect(component.isDark).toBe(true);
    });

    describe('logout button', () => {
      let logoutElement: DebugElement;
      let loggedIn: boolean;

      beforeEach(() => {
        spyOn(component.authSerivce, 'loggedIn').and.callFake(() => loggedIn);
        loggedIn = true;

        fixture.detectChanges();

        logoutElement = fixture.debugElement.query(By.css('#logout-button'));
      });

      it('should logout', () => {
        spyOn(component, 'logout');

        logoutElement.nativeElement.click();

        expect(component.logout).toHaveBeenCalled();
      });

      it('should be shown if user is logged in', () => {
        expect(logoutElement).toBeTruthy();
      });

      it('should not be shown if user is not logged in', () => {
        loggedIn = false;
        fixture.detectChanges();

        logoutElement = fixture.debugElement.query(By.css('#logout-button'));

        expect(logoutElement).toBeFalsy();
      });
    });
  });


  describe('login button', () => {
    let loginButton: DebugElement;
    let loggedIn: boolean;

    beforeEach(() => {
      spyOn(component.authSerivce, 'loggedIn').and.callFake(() => loggedIn);
      loggedIn = false;

      fixture.detectChanges();

      loginButton = fixture.debugElement.query(By.css('#login-button'));
    });

    it('should be shown if the user is not logged in', () => {
      expect(loginButton).toBeTruthy();
    });

    it('should not be shown if the user is logged in', () => {
      loggedIn = true;
      fixture.detectChanges();

      loginButton = fixture.debugElement.query(By.css('#login-button'));

      expect(loginButton).toBeFalsy();
    });

    it('should redirect users to /login', inject([Location], (location: Location) => {
      loginButton.nativeElement.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/login');
      });
    }));
  });

  describe('logout', () => {
    let authService: AuthService;
    let router: Router;
    let snackbar: MatSnackBar;

    beforeEach(() => {
      authService = TestBed.get(AuthService);
      router = TestBed.get(Router);
      snackbar = TestBed.get(MatSnackBar);
    });

    it('should log out', () => {
      spyOn(authService, 'logout').and.returnValue(true);

      component.logout();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should route to /home', () => {
      spyOn(router, 'navigateByUrl');
      spyOn(authService, 'logout').and.returnValue(true);

      component.logout();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    });

    it('should display a snackbar message', () => {
      spyOn(snackbar, 'open');
      spyOn(authService, 'logout').and.returnValue(true);

      component.logout();

      expect(snackbar.open).toHaveBeenCalledWith('Successfully Logged Out', 'DISMISS', {
        duration: 3500
      });
    });

    it('should display a snackbar message if it fails to logout', () => {
      spyOn(snackbar, 'open').and.returnValue({
        onAction: () => of()
      });
      spyOn(authService, 'logout').and.returnValue(false);

      component.logout();

      expect(snackbar.open).toHaveBeenCalledWith('Failed to Logout', 'RETRY', {
        duration: 3500
      });
    });

    it('should retry logging out if the user triggers snackbar', fakeAsync(() => {
      spyOn(authService, 'logout').and.returnValue(false);
      const action = new Subject<any[]>();
      spyOn(snackbar, 'open').and.returnValue({
        onAction: () => action.asObservable()
      });
      spyOn(component, 'logout').and.callThrough();

      component.logout();
      action.next();
      tick();

      expect(component.logout).toHaveBeenCalledTimes(2);
    }));
  });
});
