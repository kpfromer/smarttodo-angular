import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TodoComponent} from './todo.component';
import {Directive} from '@angular/core';
import {By} from '@angular/platform-browser';

@Directive({
  selector: 'app-task-list'
})
class MockTaskListDirective {
}

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TodoComponent, MockTaskListDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should include one app-task-list element', () => {

    const elements = fixture.debugElement.queryAll(By.directive(MockTaskListDirective));

    expect(elements.length).toBe(1);
  });
});
