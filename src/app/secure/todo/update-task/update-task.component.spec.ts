import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateTaskComponent} from './update-task.component';
import {MatButtonModule, MatInputModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

@Component({
  template: '<app-update-task (onCancel)="cancel($event)" (onSave)="submit($event)"></app-update-task>'
})
class TestHostComponent {
  cancel(canceled) {
  }

  submit(description) {
  }
}

describe('UpdateTaskComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule
      ],
      declarations: [
        UpdateTaskComponent,
        TestHostComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel', () => {
    spyOn(component, 'cancel');
    const button = fixture.debugElement.query(By.css('#cancel-button'));

    button.nativeElement.click();

    expect(component.cancel).toHaveBeenCalledWith(true);
  });

  it('should submit new description', () => {
    spyOn(component, 'submit');
    const expectedDescription = 'math homework';

    const description = fixture.nativeElement.querySelector('#description-input');
    const button = fixture.nativeElement.querySelector('#submit-button');

    description.value = expectedDescription;
    description.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    button.click();

    expect(component.submit).toHaveBeenCalledWith(expectedDescription);
  });

  describe('description input', () => {
    it('should be required', () => {
      spyOn(component, 'submit');
      const emptyDescription = '';

      const description = fixture.nativeElement.querySelector('#description-input');
      const button = fixture.nativeElement.querySelector('#submit-button');

      description.value = emptyDescription;
      description.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      button.click();

      expect(component.submit).not.toHaveBeenCalled();
    });
  });

});
