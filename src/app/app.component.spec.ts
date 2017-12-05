import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSidenavModule, MatSnackBarModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayContainer} from '@angular/cdk/overlay';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatMenuModule,
        MatSnackBarModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
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
});
