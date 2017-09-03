import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlashMessageComponent} from './flash-message.component';
import {By} from '@angular/platform-browser';

describe('FlashMessageComponent', () => {
  let component: FlashMessageComponent;
  let fixture: ComponentFixture<FlashMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashMessageComponent);
    component = fixture.componentInstance;

    component.message = 'Error: Something bad!';
    component.status = 'red';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
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
