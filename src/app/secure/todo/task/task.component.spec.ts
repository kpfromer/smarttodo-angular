import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TaskComponent} from './task.component';
import {Task} from '../shared/task';
import {By} from '@angular/platform-browser';
import {TaskService} from '../shared/task.service';
import {Observable} from 'rxjs/Observable';

class MockTaskService {

  patchTaskById(id: string, properties) {
    return;
  }
}

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: TaskService, useClass: MockTaskService}],
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

    it('should change complete if clicked', () => {
      const checkboxElement = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      checkboxElement.nativeElement.click();
      fixture.detectChanges();

      expect(component.task.complete).toBe(false);
    });

    it('should patch task if clicked', fakeAsync(() => {
      const taskService = TestBed.get(TaskService);
      spyOn(taskService, 'patchTaskById').and.returnValue(Observable.of({status: 200}));

      const checkboxElement = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      checkboxElement.nativeElement.click();
      tick();

      expect(taskService.patchTaskById).toHaveBeenCalledWith('1', {complete: false});
    }));
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
