import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TaskListComponent} from './task-list.component';
import {SavedTask} from '../shared/saved-task';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, EventEmitter, Input, Output} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TaskService} from '../shared/task.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {HttpErrorResponse} from '@angular/common/http';
import {TemporaryTask} from '../shared/temporary-task';
import any = jasmine.any;
import objectContaining = jasmine.objectContaining;
import stringMatching = jasmine.stringMatching;


@Directive({
  selector: 'app-task'
})
class MockTaskDirective {
  @Input('task')
  public task: SavedTask;

  @Output() onError = new EventEmitter<Error | HttpErrorResponse>();
}

@Directive({
  selector: 'app-new-task'
})
class MockNewTaskDirective {
  @Output() onCreate = new EventEmitter<{
    description: string,
    complete: boolean
  }>();
}

@Directive({
  selector: 'app-flash-message'
})
class MockFlashMessage {

}

class MockTaskService {

  getTasks() {
    return Observable.of([]);
  }

  createTask(task: TemporaryTask) {
    return;
  }
}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      providers: [
        {provide: TaskService, useClass: MockTaskService}
      ],
      declarations: [
        TaskListComponent,
        MockNewTaskDirective,
        MockTaskDirective,
        MockFlashMessage
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    taskService = TestBed.get(TaskService);

    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get tasks on creation', () => {
    spyOn(component, 'getTasks');
    component.ngOnInit();
    expect(component.getTasks).toHaveBeenCalled();
  });

  it('should create a task component for every task in tasks', () => {
    component.tasks = [
      new SavedTask({
        _id: '1',
        description: 'math worksheet',
        complete: false
      }),
      new SavedTask({
        _id: '2',
        description: 'science',
        complete: true
      })
    ];

    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.directive(MockTaskDirective));

    expect(elements.length).toBe(2);

  });

  it('should pass down task object', () => {
    component.tasks = [
      new SavedTask({
        _id: '1',
        description: 'science',
        complete: true
      })
    ];

    fixture.detectChanges();

    const mockTaskElement = fixture.debugElement.query(By.directive(MockTaskDirective));
    const mockTaskComponent = mockTaskElement.injector.get(MockTaskDirective) as MockTaskDirective; // todo fix to match test below

    expect(mockTaskComponent.task).toEqual(new SavedTask({
      _id: '1',
      description: 'science',
      complete: true
    }));
  });

  it('should create a new task', fakeAsync(() => {
    spyOn(component, 'createTask');
    const newTask = fixture.debugElement.query(By.directive(MockNewTaskDirective))
      .injector.get(MockNewTaskDirective) as MockNewTaskDirective;

    newTask.onCreate.emit({
      description: 'hello description',
      complete: false
    });
    tick();

    expect(component.createTask).toHaveBeenCalledWith({
      description: 'hello description',
      complete: false
    });
  }));

  it('should render error flashmessage when error for a task', fakeAsync(() => {
    component.tasks = [
      new SavedTask({
        _id: '1',
        description: 'math worksheet',
        complete: false
      })
    ];
    fixture.detectChanges();

    const task = fixture.debugElement.query(By.directive(MockTaskDirective))
      .injector.get(MockTaskDirective) as MockTaskDirective;

    task.onError.emit(new Error('Wow, an error!'));
    tick();
    fixture.detectChanges();

    expect(component.error).toBe(true);
  }));

  it('should not display flashmessage on load', () => {
    component.error = false;
    fixture.detectChanges();

    const flashmessage = fixture.debugElement.query(By.directive(MockFlashMessage));
    expect(flashmessage).toBeNull();
  });

  it('should display flashmessage on error', () => {
    component.error = true;
    fixture.detectChanges();

    const flashmessage = fixture.debugElement.query(By.directive(MockFlashMessage));
    expect(flashmessage).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should get tasks', fakeAsync(() => {
      spyOn(taskService, 'getTasks').and.returnValue(Observable.of([
        {
          _id: 'IDS!',
          description: 'hello!',
          complete: false
        }
      ]));

      component.getTasks();
      tick();

      expect(component.tasks).toEqual([
        {
          _id: 'IDS!',
          description: 'hello!',
          complete: false
        }
      ] as SavedTask[]);
    }));

    it('should render error flashmessage when 404 error', fakeAsync(() => {
      spyOn(taskService, 'getTasks').and.returnValue(Observable.throw(new HttpErrorResponse({
        status: 404,
        statusText: 'Not found'
      })));

      component.getTasks();
      tick();
      fixture.detectChanges();

      expect(component.error).toBe(true);
    }));

    it('should render error flashmessage when client side error', fakeAsync(() => {
      spyOn(taskService, 'getTasks').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: new Error('a client side error!')
      })));

      component.getTasks();
      tick();
      fixture.detectChanges();

      expect(component.error).toBe(true);
    }));
  });

  describe('addTemporaryTask', () => {
    let tempTask: TemporaryTask;

    beforeEach(() => {
      tempTask = new TemporaryTask({
        tempId: 'messystringlol',
        description: 'test',
        complete: false
      });
    });

    it('should add a TemporaryTask to the task list', () => {
      component.addTemporaryTask(tempTask);

      const task = component.tasks[0];

      expect(component.tasks.length).toBe(1);
      expect(task instanceof TemporaryTask).toBe(true);
      expect(task).toEqual(objectContaining({
        tempId: 'messystringlol',
        description: 'test',
        complete: false
      }));
    });
  });

  describe('createTask', () => {

    let task;

    beforeEach(() => {
      task = {
        description: 'i am an epic new task',
        complete: false
      };
    });

    it('should call addTemporaryTask', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.of({status: 200}));
      const addTask = spyOn(component, 'addTemporaryTask');

      component.createTask(task);
      tick();

      expect(component.addTemporaryTask).toHaveBeenCalled();

      const tempTask = addTask.calls.mostRecent().args[0];

      expect(tempTask instanceof TemporaryTask).toBe(true);
      expect(tempTask).toEqual(objectContaining({
        tempId: stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        description: 'i am an epic new task',
        complete: false
      }));
    }));

    it('should replace the TemporaryTask with a SavedTask on POST response', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.of(
        {
          _id: 'i am an id',
          description: 'test123',
          complete: true
        }
      ));

      component.createTask(task);
      tick();

      const tasks = component.tasks;
      const newTask = tasks[0];

      expect(tasks.length).toBe(1);

      expect(newTask).toEqual({
        _id: 'i am an id',
        description: 'test123',
        complete: true
      } as SavedTask);
    }));

    it('should post to taskService', fakeAsync(() => {
      const update = spyOn(taskService, 'createTask').and.returnValue(Observable.of({status: 200}));

      component.createTask(task);
      tick();

      console.log(typeof update.calls.mostRecent().args[0]);
      console.log(update.calls.mostRecent().args[0] instanceof TemporaryTask);
      console.log(update.calls.mostRecent().args[0]);

      const newTask = update.calls.mostRecent().args[0];

      expect(newTask instanceof TemporaryTask).toBe(true);
      expect(newTask).toEqual(objectContaining({
        tempId: any(String),
        description: 'i am an epic new task',
        complete: false
      }));
    }));

    it('should render error flashmessage when 404 error', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.throw(new HttpErrorResponse({
        status: 404,
        statusText: 'Not found'
      })));

      component.createTask(task);
      tick();

      expect(component.error).toBe(true);
    }));

    it('should render error flashmessage when client side error', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: new Error('a client side error!')
      })));

      component.createTask(task);
      tick();
      fixture.detectChanges();

      expect(component.error).toBe(true);
    }));

    it('should delete temporary task on POST error', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: new Error('a client side error!')
      })));

      component.createTask(task);
      tick();

      expect(component.tasks.length).toBe(0);
    }));
  });

  // todo: upload tasks to website on reconnect

});
