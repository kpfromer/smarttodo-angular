import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskListComponent} from './task-list.component';
import {Task} from '../shared/task';
import {CUSTOM_ELEMENTS_SCHEMA, Directive, Input} from '@angular/core';
import {By} from '@angular/platform-browser';


@Directive({
  selector: 'app-task'
})
class MockTaskDirective {
  @Input('task')
  public task: Task;
}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskListComponent,
        MockTaskDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create a task component for every task in tasks', () => {
    component.tasks = [
      new Task('1', 'math worksheet', false),
      new Task('2', 'science', true)
    ];

    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.directive(MockTaskDirective));

    expect(elements.length).toBe(2);

  });
  it('should pass down task object', () => {
    component.tasks = [
      new Task('1', 'science', true)
    ];

    fixture.detectChanges();

    const mockTaskElement = fixture.debugElement.query(By.directive(MockTaskDirective));
    const mockTaskComponent = mockTaskElement.injector.get(MockTaskDirective) as MockTaskDirective;

    expect(mockTaskComponent.task).toBeTruthy();
    expect(mockTaskComponent.task.id).toBe('1');
    expect(mockTaskComponent.task.description).toBe('science');
    expect(mockTaskComponent.task.complete).toBe(true);
  });
});
