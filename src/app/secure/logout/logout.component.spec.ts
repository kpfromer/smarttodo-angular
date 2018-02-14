import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LogoutComponent} from './logout.component';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import createSpy = jasmine.createSpy;

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  const mockRouter = {
    navigateByUrl: createSpy('navigateByUrl')
  };

  const mockSnackBar = {
    open: createSpy('open')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: MatSnackBar, useValue: mockSnackBar}
      ],
      declarations: [ LogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should remove localStorage id_token', () => {
      spyOn(localStorage, 'removeItem');

      component.logOut();

      expect(localStorage.removeItem).toHaveBeenCalled();
    });
    it('should redirect user to /home', () => {
      component.logOut();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/home');
    });

    it('should display a snack-bar notification', () => {
      component.logOut();

      expect(mockSnackBar.open).toHaveBeenCalledWith('Successfully Logged Out', 'DISMISS', {
        duration: 3500
      });
    });
  });
});


// @Component({
//   template: `<app-logout></app-logout>`
// });
// class MockHostComponent {
//   let hostComponent: MockHostComponent;
//   let fixture: ComponentFixture<MockHostComponent>;
// }
