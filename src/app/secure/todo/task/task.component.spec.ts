import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskComponent} from './task.component';
import {Task} from '../shared/task';
import {By} from '@angular/platform-browser';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskComponent]
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
    it('should have an id', () => {
      const checkboxElement = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkboxElement.nativeElement.getAttribute('id')).toBe(`task${component.task.id}`);
    });

    it('should be checked', () => {
      const checkboxElement = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkboxElement.nativeElement.checked).toBe(true);
    });
  });

  describe('description label', () => {
    it('should be for the checkbox', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.getAttribute('for')).toBe(`task${component.task.id}`);
    });

    it('should display task description', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.textContent.includes('Hello!')).toBe(true);
    });

    it('should have text-decoration style of line-through', () => {
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.style.textDecorationLine).toBe('line-through');
    });

    it('should remove text-decoration style of line-through', () => {
      component.task.complete = false;
      fixture.detectChanges();

      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.style.textDecorationLine).toBeFalsy();
    });
  });
});
