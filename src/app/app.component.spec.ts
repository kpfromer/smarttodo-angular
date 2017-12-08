import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSidenavModule, MatSnackBar, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AuthService} from './shared/auth.service';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {Subject} from 'rxjs/Subject';

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
