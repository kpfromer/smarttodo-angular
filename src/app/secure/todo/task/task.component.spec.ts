import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TaskComponent} from './task.component';
import {Task} from '../shared/task';
import {TaskService} from '../shared/task.service';
import {Observable} from 'rxjs/Observable';
import {Component, CUSTOM_ELEMENTS_SCHEMA, Directive, EventEmitter, Output, ViewChild} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MatCheckbox, MatCheckboxChange, MatCheckboxModule} from '@angular/material';
import {SatPopoverModule} from '@ncstate/sat-popover';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

class MockTaskService {
  patchTaskById(id: string, properties): Observable<Task> {
    return;
  }
}

@Directive({
  selector: 'app-update-task'
})
class MockUpdateTaskDirective {
  @Output() onSave = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<boolean>();
}

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        SatPopoverModule,
        BrowserAnimationsModule
      ],
      providers: [{provide: TaskService, useClass: MockTaskService}],
      declarations: [
        TaskComponent,
        MockUpdateTaskDirective
      ],
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

  describe('popover', () => {
    const getPopover = () => fixture.nativeElement.querySelector('#description-update');

    it('should be hidden by default', () => {
      expect(fixture.nativeElement.querySelector('#description-update')).toBeNull();
    });

    it('should start editing on label click', () => {
      let popoverElement = fixture.nativeElement.querySelector('#description-label');

      popoverElement.click();

      popoverElement = fixture.nativeElement.querySelector('#description-label');
      expect(popoverElement).toBeTruthy();
    });

    describe('start in editing mode', () => {

      beforeEach(() => {
        component.startEditing();
        fixture.detectChanges();
      });

      it('should hide on cancel', () => {
        const updateTask = fixture.debugElement.query(By.directive(MockUpdateTaskDirective))
          .injector.get(MockUpdateTaskDirective) as MockUpdateTaskDirective;

        updateTask.onCancel.emit(true);
        fixture.detectChanges();

        expect(getPopover()).toBeNull();
      });

      it('should hide on save', () => {
        const updateTask = fixture.debugElement.query(By.directive(MockUpdateTaskDirective))
          .injector.get(MockUpdateTaskDirective) as MockUpdateTaskDirective;

        updateTask.onSave.emit('this does not matter!');
        fixture.detectChanges();

        expect(getPopover()).toBeNull();
      });

      it('should update description on save', () => {
        const newDescription = 'new desc';

        spyOn(component, 'updateDescription');
        const updateTask = fixture.debugElement.query(By.directive(MockUpdateTaskDirective))
          .injector.get(MockUpdateTaskDirective) as MockUpdateTaskDirective;

        updateTask.onSave.emit(newDescription);
        fixture.detectChanges();

        expect(component.updateDescription).toHaveBeenCalledWith(newDescription);
      });
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
      imports: [
        MatCheckboxModule,
        SatPopoverModule,
        BrowserAnimationsModule
      ],
      providers: [{provide: TaskService, useClass: MockTaskService}],
      declarations: [
        MockUpdateTaskDirective,
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
