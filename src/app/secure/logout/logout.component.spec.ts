import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LogoutComponent} from './logout.component';
import {Router} from '@angular/router';
import createSpy = jasmine.createSpy;

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  const mockRouter = {
    navigateByUrl: createSpy('navigateByUrl')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Router, useValue: mockRouter}],
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
  });
});
