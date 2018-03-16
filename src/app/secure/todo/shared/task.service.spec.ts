import {async, TestBed} from '@angular/core/testing';

import {TaskService} from './task.service';
import {SavedTask} from './saved-task';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TemporaryTask} from './temporary-task';

describe('TaskService', () => {

  let service: TaskService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.get(TaskService);
    http = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should use /task', async(() => {
      service.getTasks().subscribe();

      http.expectOne(`/task`);
    }));

    it('should GET', () => {
      service.getTasks().subscribe();

      const req = http.expectOne(`/task`);
      expect(req.request.method).toBe('GET');
    });

    it('should return a list of SavedTasks', () => {
      service.getTasks().subscribe(tasks => {
        expect(tasks[0]).toEqual(new SavedTask({
          _id: 'one',
          description: 'math hw',
          complete: false
        } as SavedTask));
        expect(tasks[1]).toEqual(new SavedTask({
          _id: 'two',
          description: 'science workbook',
          complete: false
        } as SavedTask));
        expect(tasks[2]).toEqual(new SavedTask({
          _id: 'three',
          description: 'pg 1-100',
          complete: true
        } as SavedTask));
      });

      http.expectOne(`/task`).flush([
          {
            _id: 'one',
            description: 'math hw',
            complete: false
          },
          {
            _id: 'two',
            description: 'science workbook',
            complete: false
          },
          {
            _id: 'three',
            description: 'pg 1-100',
            complete: true
          }
      ]);
    });
  });

  describe('getTaskById', () => {
    it('should use /task/{id}', () => {
      service.getTaskById('i-am-a-mongo-id!').subscribe();

      http.expectOne(`/task/i-am-a-mongo-id!`);
    });

    it('should GET', () => {
      service.getTaskById('i-am-a-mongo-id!').subscribe();

      const req = http.expectOne(`/task/i-am-a-mongo-id!`);
      expect(req.request.method).toBe('GET');
    });

    it('should return a SavedTask', () => {
      service.getTaskById('one').subscribe(task => {
        expect(task).toEqual({
          _id: 'one',
            description: 'a cool task',
            complete: true
        } as SavedTask);
      });

      http.expectOne(`/task/one`).flush({
        _id: 'one',
          description: 'a cool task',
          complete: true
      } as SavedTask);
    });
  });

  describe('createTask', () => {
    let task;
    beforeEach(() => {
      task = new TemporaryTask({
        tempId: 'i should not be included',
        description: 'math homework',
        complete: false
      } as TemporaryTask);
    });

    it('should use /task', () => {
      service.createTask(task).subscribe();

      http.expectOne(`/task`);
    });

    it('should post a TemporaryTask', () => {
      service.createTask(task).subscribe();

      const req = http.expectOne(`/task`);
      console.dir(req);
      expect(req.request.body).toEqual({
        description: 'math homework',
        complete: false
      });
    });

    it('should POST', () => {
      service.createTask(task).subscribe();

      const req = http.expectOne(`/task`);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('updateTask', () => {
    let task: SavedTask;

    beforeEach(() => {
      task = new SavedTask({
        _id: 'i-should-be-included',
        description: 'science worksheet',
        complete: true
      } as SavedTask);
    });

    it('should use /task/{id}', () => {
      service.updateTaskById(task).subscribe();

      http.expectOne(`/task/i-should-be-included`);
    });

    it('should update task', () => {
      service.updateTaskById(task).subscribe();

      const req = http.expectOne(`/task/i-should-be-included`);
      expect(req.request.body).toEqual(new SavedTask({
        _id: 'i-should-be-included',
        description: 'science worksheet',
        complete: true
      } as SavedTask));
    });

    it('should PUT', () => {
      service.updateTaskById(task).subscribe();

      const req = http.expectOne(`/task/i-should-be-included`);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('patchTaskById', () => {
    it('should use /task/{id}', () => {
      service.patchTaskById('anId', {newProp: true}).subscribe();

      http.expectOne(`/task/anId`);
    });

    it('should PATCH', () => {
      service.patchTaskById('anId', {newProp: true}).subscribe();

      const req = http.expectOne(`/task/anId`);
      expect(req.request.method).toBe('PATCH');
    });

    it('should pass new properties', () => {
      service.patchTaskById('anId', {newProp: true}).subscribe();

      const req = http.expectOne(`/task/anId`);
      expect(req.request.body).toEqual({
        newProp: true
      });
    });
  });

  describe('deleteTaskById', () => {
    it('should use /task/{id}', () => {
      service.deleteTaskById('anId').subscribe();

      http.expectOne(`/task/anId`);
    });

    it('should DELETE', () => {
      service.deleteTaskById('anId').subscribe();

      const req = http.expectOne(`/task/anId`);
      expect(req.request.method).toBe('DELETE');
    });
  });
});
