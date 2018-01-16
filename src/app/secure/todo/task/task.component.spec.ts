import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TaskComponent} from './task.component';
import {Task} from '../shared/task';
import {By} from '@angular/platform-browser';
import {TaskService} from '../shared/task.service';
import {Observable} from 'rxjs/Observable';
import {Component, CUSTOM_ELEMENTS_SCHEMA, Directive, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MatCheckbox, MatCheckboxChange, MatCheckboxModule} from '@angular/material';

class MockTaskService {
  patchTaskById(id: string, properties): Observable<Task> {
    return;
  }
}

@Directive({
  selector: 'app-inline-editor'
})
class MockInlineEditorDirective {

  @Output() onSave = new EventEmitter<{ input: any }>();
  @Input() required: boolean;
  @Input() disabled = false;
  @Input() forId: string;
  @Input() type: string;

  @Input() ngModel;
}

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      providers: [{provide: TaskService, useClass: MockTaskService}],
      declarations: [TaskComponent, MockInlineEditorDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    component.task = new Task({
      id: '1',
      description: 'Hello!',
      complete: true
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('checkbox', () => {

    const getCheckboxElement = () => fixture.debugElement.query(By.css('mat-checkbox'));
    const getCheckbox = () => getCheckboxElement().injector.get(MatCheckbox);
    const checkboxClick = () => {
      const checkbox = getCheckbox();
      checkbox.change.emit({
        source: checkbox,
        checked: !checkbox.checked
      } as MatCheckboxChange);
    };

    it('should have an id', () => {
      const checkboxElement = getCheckboxElement();
      expect(checkboxElement.nativeElement.getAttribute('id')).toBe(`task${component.task.id}`);
    });

    it('should be checked', () => {
      const checkboxElement = getCheckbox();
      expect(checkboxElement.checked).toBe(true);
    });

    it('should change complete if clicked', () => {
      checkboxClick();
      fixture.detectChanges();

      expect(component.task.complete).toBe(false);
    });

    it('should patch task if clicked', fakeAsync(() => {
      const taskService = TestBed.get(TaskService);
      spyOn(taskService, 'patchTaskById').and.returnValue(Observable.of({}));

      checkboxClick();
      tick();

      expect(taskService.patchTaskById).toHaveBeenCalledWith('1', {complete: false});
    }));
  });

  describe('description inline editor', () => {
    it('should be for the checkbox', () => {
      const inlineEditor = fixture.debugElement.query(By.directive(MockInlineEditorDirective))
        .injector.get(MockInlineEditorDirective); // todo Put in beforeEach

      expect(inlineEditor.forId).toBe(`task${component.task.id}`);
    });

    it('should input text', () => {
      const inlineEditor = fixture.debugElement.query(By.directive(MockInlineEditorDirective))
        .injector.get(MockInlineEditorDirective);

      expect(inlineEditor.type).toBe('text');
    });

    it('should be required', () => {
      const inlineEditor = fixture.debugElement.query(By.directive(MockInlineEditorDirective))
        .injector.get(MockInlineEditorDirective);

      expect(inlineEditor.required).toBe(true);
    });

    it('should not be disabled', () => {
      const inlineEditor = fixture.debugElement.query(By.directive(MockInlineEditorDirective))
        .injector.get(MockInlineEditorDirective);

      expect(inlineEditor.disabled).toBe(false);
    });

    it('should display task description', () => {
      const inlineEditor = fixture.debugElement.query(By.directive(MockInlineEditorDirective))
        .injector.get(MockInlineEditorDirective);

      expect(inlineEditor.ngModel).toBe('Hello!');
    });

    it('should have text-decoration style of line-through', () => {
      const inlineEditorElement = fixture.debugElement.query(By.directive(MockInlineEditorDirective));

      expect(inlineEditorElement.nativeElement.style.textDecorationLine).toBe('line-through');
    });

    it('should remove text-decoration style of line-through', () => {
      component.task.complete = false;
      fixture.detectChanges();

      const inlineEditorElement = fixture.debugElement.query(By.directive(MockInlineEditorDirective));
      expect(inlineEditorElement.nativeElement.style.textDecorationLine).toBeFalsy();
    });
  });
});

@Component({
  template: `
    <app-task #taskEle [task]="task" (onError)="error = true"></app-task>
  `
})
class HostComponent {

  @ViewChild('taskEle') taskElement: TaskComponent;

  task: Task;

  error: boolean;
}

describe('TaskComponent: HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let taskService: TaskService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: TaskService, useClass: MockTaskService}],
      declarations: [
        MockInlineEditorDirective,
        TaskComponent,
        HostComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);

    component.task = new Task({
      id: 'coolId',
      description: 'math/science',
      complete: false
    });
    component.error = false;

    fixture.detectChanges();
  });

  describe('check', () => {
    it('should emit onError when not a 404 status', fakeAsync(() => {
      spyOn(taskService, 'patchTaskById').and.returnValue(Observable.throw(new HttpErrorResponse({
        status: 404,
        statusText: 'Not found'
      })));

      component.taskElement.click(true);
      tick();

      expect(component.error).toBe(true);
    }));

    it('should emit onError when not a client side error occurs', fakeAsync(() => {
      spyOn(taskService, 'patchTaskById').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: new Error('a client side error!')
      })));

      component.taskElement.click(true);
      tick();

      expect(component.error).toBe(true);
    }));
  });

  describe('updateDescription', () => {
    it('should emit onError when not a 404 status', fakeAsync(() => {
      spyOn(taskService, 'patchTaskById').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: '404 error'
      })));

      component.taskElement.updateDescription('new Description!');
      tick();

      expect(component.error).toBe(true);
    }));

    it('should emit onError when not a client side error occurs', fakeAsync(() => {
      spyOn(taskService, 'patchTaskById').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: new Error('a client side error!')
      })));

      component.taskElement.updateDescription('new Description!');
      tick();

      expect(component.error).toBe(true);
    }));
  });
});
