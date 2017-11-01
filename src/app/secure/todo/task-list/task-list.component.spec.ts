import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TaskListComponent} from './task-list.component';
import {Task} from '../shared/task';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, EventEmitter, Input, Output} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TaskService} from '../shared/task.service';
import {Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {HttpErrorResponse} from '@angular/common/http';
import any = jasmine.any;


@Directive({
  selector: 'app-task'
})
class MockTaskDirective {
  @Input('task')
  public task: Task;

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

class MockTaskService {

  getTasks() {
    return Observable.of(new Response(new ResponseOptions({
      status: 200,
      body: {
        data: []
      }
    })));
  }

  createTask(task: { id: string, description: string, complete: boolean }) {
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
        {provide: TaskService, useClass: MockTaskService},
        /*{provide: TaskStorageService, useClass: MockLocalStorage}*/
        ],
      declarations: [
        TaskListComponent,
        MockNewTaskDirective,
        MockTaskDirective
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
      new Task({
        id: '1',
        description: 'math worksheet',
        complete: false
      }),
      new Task({
        id: '2',
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
      new Task({
        id: '1',
        description: 'science',
        complete: true
      })
    ];

    fixture.detectChanges();

    const mockTaskElement = fixture.debugElement.query(By.directive(MockTaskDirective));
    const mockTaskComponent = mockTaskElement.injector.get(MockTaskDirective) as MockTaskDirective;

    expect(mockTaskComponent.task).toEqual(new Task({
      id: '1',
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
      new Task({
        id: '1',
        description: 'math worksheet',
        complete: false
      })
    ];
    fixture.detectChanges();

    const task = fixture.debugElement.query(By.directive(MockTaskDirective))
      .injector.get(MockTaskDirective) as MockTaskDirective;

    let flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
    expect(flashmessage).toBeNull();
    // todo: move to own test

    task.onError.emit(new Error('Wow, an error!'));
    tick();
    fixture.detectChanges();

    flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
    expect(flashmessage).toBeTruthy(); // todo: move to own test?
    expect(component.error).toBe(true);
  }));

  describe('getTasks', () => {
    it('should get tasks', fakeAsync(() => {
      spyOn(taskService, 'getTasks').and.returnValue(Observable.of(
        {
          status: 200,
          json: () => {
            return {
              data:
                [
                  {
                    id: 'IDS!',
                    description: 'hello!',
                    complete: false
                  }
                ]
            };
          }
        }
      ));

      component.getTasks();
      tick();

      expect(JSON.stringify(component.tasks)).toEqual(JSON.stringify([
        {
          id: 'IDS!',
          description: 'hello!',
          complete: false
        }
      ]));
    }));

    it('should render error flashmessage when status code is not 200', fakeAsync(() => {
      spyOn(taskService, 'getTasks').and.returnValue(Observable.of({status: 400}));
      let flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeNull();

      component.getTasks();
      tick();
      fixture.detectChanges();

      flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeTruthy();
      expect(component.error).toBe(true);
    }));

    it('should render error flashmessage when 404 error', fakeAsync(() => {
      spyOn(taskService, 'getTasks').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: 'a 404 error'
      })));
      let flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeNull();

      component.getTasks();
      tick();
      fixture.detectChanges();

      flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeTruthy();
      expect(component.error).toBe(true);
    }));

    // todo: should we make test dry? Will it make it less readable?
    it('should render error flashmessage when client side error', fakeAsync(() => {
      spyOn(taskService, 'getTasks').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: new Error('a client side error!')
      })));
      let flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeNull();

      component.getTasks();
      tick();
      fixture.detectChanges();

      flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeTruthy();
      expect(component.error).toBe(true);
    }));
  });

  describe('createTask', () => {

    let task;

    beforeEach(() => {
      task = {
        description: 'i am an epic new task',
        complete: false
      };
    });

    it('should generate a uuid for task', fakeAsync(() => {
      const createTask = spyOn(taskService, 'createTask').and.returnValue(Observable.of({status: 200}));
      component.createTask(task);
      tick();

      const argumentObject = createTask.calls.mostRecent().args[0];
      expect(argumentObject.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    }));

    it('should add it to tasks', () => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.of({status: 200}));

      component.createTask(task);

      const tasks = component.tasks;
      const newTask = tasks[0];

      expect(tasks.length).toBe(1);
      expect(newTask.id).toEqual(any(String));
      expect(newTask.description).toBe('i am an epic new task');
      expect(newTask.complete).toBe(false);
    });

    it('should post to taskService', fakeAsync(() => {
      const update = spyOn(taskService, 'createTask').and.returnValue(Observable.of({status: 200}));

      component.createTask(task);
      tick();

      expect(update.calls.mostRecent().args[0].toJSON()).toEqual({
        id: any(String),
        description: 'i am an epic new task',
        complete: false
      });
    }));

    it('should render error flashmessage when status code is not 200', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.of({status: 400}));
      let flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeNull();

      component.createTask(task);
      tick();
      fixture.detectChanges();

      flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeTruthy();
      expect(component.error).toBe(true);
    }));

    it('should render error flashmessage when 404 error', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: 'a 404 error'
      })));
      let flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeNull();

      component.createTask(task);
      tick();
      fixture.detectChanges();

      flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeTruthy();
      expect(component.error).toBe(true);
    }));

    // todo: should we make test dry? Will it make it less readable?
    it('should render error flashmessage when client side error', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(Observable.throw(new HttpErrorResponse({
        error: new Error('a client side error!')
      })));
      let flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeNull();

      component.createTask(task);
      tick();
      fixture.detectChanges();

      flashmessage = fixture.debugElement.query(By.css('app-flash-message'));
      expect(flashmessage).toBeTruthy();
      expect(component.error).toBe(true);
    }));
  });

  // todo: upload tasks to website on reconnect

});
