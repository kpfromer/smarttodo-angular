import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlashMessageComponent} from './flash-message.component';
import {By} from '@angular/platform-browser';
import {Component, DebugElement} from '@angular/core';
import {MatIconModule} from '@angular/material';


@Component({
  template: `
    <app-flash-message [color]="color" [icon]="icon">{{message}}</app-flash-message>
  `
})
class MockHostComponent {
  color: string;
  message: string;
  icon: string | null;
}

describe('FlashMessageComponent', () => {
  let hostComponent: MockHostComponent;
  let fixture: ComponentFixture<MockHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [ MockHostComponent, FlashMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockHostComponent);
    hostComponent = fixture.componentInstance;

    hostComponent.message = 'Error: Something bad!';
    hostComponent.color = 'accent';
    hostComponent.icon = 'label';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(hostComponent).toBeTruthy();
  });

  describe('text', () => {
    let textElement: DebugElement;
    beforeEach(() => {
      textElement = fixture.debugElement.query(By.css('span'));
    });

    it('should display message', () => {
      expect(textElement.nativeElement.textContent).toBe('Error: Something bad!');
    });

    it('should use color', () => {
      expect(textElement.classes.accent).toBe(true);
    });
  });

  describe('icon', () => {
    let iconElement: DebugElement;
    beforeEach(() => {
      iconElement = fixture.debugElement.query(By.css('mat-icon'));
    });

    it('should display a custom icon', () => {
      expect(iconElement.nativeElement.textContent).toBe('label');
    });

    it('should not display an icon', () => {
      hostComponent.icon = null;
      fixture.detectChanges();
      iconElement = fixture.debugElement.query(By.css('mat-icon'));

      expect(iconElement).toBe(null);
    });

    it('should use color', () => {
      // ng-reflect-color gets the color attribute of the icon
      expect(iconElement.nativeElement.getAttribute('ng-reflect-color')).toBe('accent');
    });
  });
});
