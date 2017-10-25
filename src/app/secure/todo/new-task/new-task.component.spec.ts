import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {NewTaskComponent} from './new-task.component';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {Component, ViewChild} from '@angular/core';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ NewTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('createTask', () => {

    function submitForm() {
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', null);
      fixture.detectChanges();
    }

    it('should be called with valid inputs', () => {
      spyOn(component, 'createTask');

      component.newTaskForm.setValue({description: 'Hello!'});

      submitForm();

      expect(component.createTask).toHaveBeenCalledWith('Hello!');
    });

    it('should not be called if validation errors', () => {
      spyOn(component, 'createTask');

      component.newTaskForm.setValue({description: ''});

      submitForm();

      expect(component.createTask).not.toHaveBeenCalled();
    });

    it('should reset form', () => {
      spyOn(component.newTaskForm, 'reset');

      component.newTaskForm.setValue({description: 'I should be null!'});

      submitForm();

      expect(component.newTaskForm.reset).toHaveBeenCalled();
    });
  });
});

@Component({
  template: `<app-new-task #newTask (onCreate)="saveEvent($event)"></app-new-task>`
})
class TestHostComponent {

  @ViewChild('newTask') newTask: NewTaskComponent;

  constructor() {
  }

  saveEvent(event) {
  }
}

describe('NewTaskComponent: HostComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ TestHostComponent, NewTaskComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('createTask', () => {
    it('should emit onSave event', fakeAsync(() => {
      spyOn(component, 'saveEvent');

      component.newTask.createTask('hello world');
      tick();

      expect(component.saveEvent).toHaveBeenCalledWith({description: 'hello world', complete: false});
    }));
  });
});
