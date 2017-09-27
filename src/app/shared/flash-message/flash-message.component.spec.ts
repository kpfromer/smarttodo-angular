import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlashMessageComponent} from './flash-message.component';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';


@Component({
  template: `
  <app-flash-message [status]="status">{{message}}</app-flash-message>
  `
})
class MockHostComponent {
  status: string;
  message: string;
}

describe('FlashMessageComponent', () => {
  let hostComponent: MockHostComponent;
  let fixture: ComponentFixture<MockHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockHostComponent, FlashMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockHostComponent);
    hostComponent = fixture.componentInstance;

    hostComponent.message = 'Error: Something bad!';
    hostComponent.status = 'red';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should display message', () => {
    const paragraphElement = fixture.debugElement.query(By.css('p'));
    expect(paragraphElement.nativeElement.textContent).toBe('Error: Something bad!');
  });

  it('should display status color', () => {
    const paragraphElement = fixture.debugElement.query(By.css('#card-alert'));
    expect(paragraphElement.classes.red).toBe(true);
  });
});
