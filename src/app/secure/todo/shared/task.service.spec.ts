import {async, TestBed} from '@angular/core/testing';

import {TaskService} from './task.service';
import {Task} from './task';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../../environments/environment';

const url = environment.apiUrl;

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
    it('should use /tasks', async(() => {
      service.getTasks().subscribe();

      http.expectOne(`${url}/tasks`);
    }));

    it('should GET', () => {
      service.getTasks().subscribe();

      const req = http.expectOne(`${url}/tasks`);
      expect(req.request.method).toBe('GET');
    });

    it('should return a list of Tasks', () => {
      service.getTasks().subscribe(base => {
        expect(base.data[0]).toEqual({
          id: 'one',
          description: 'math hw',
          complete: false
        });
        expect(base.data[1]).toEqual({
          id: 'two',
          description: 'science workbook',
          complete: false
        });
        expect(base.data[2]).toEqual({
          id: 'three',
          description: 'pg 1-100',
          complete: true
        });
      });

      http.expectOne(`${url}/tasks`).flush({
        data: [
          {
            id: 'one',
            description: 'math hw',
            complete: false
          },
          {
            id: 'two',
            description: 'science workbook',
            complete: false
          },
          {
            id: 'three',
            description: 'pg 1-100',
            complete: true
          }
        ]
      });
    });
  });

  describe('getTaskById', () => {
    it('should use /task/{id}', () => {
      service.getTaskById('i-am-a-mongo-id!').subscribe();

      http.expectOne(`${url}/task/i-am-a-mongo-id!`);
    });

    it('should GET', () => {
      service.getTaskById('i-am-a-mongo-id!').subscribe();

      const req = http.expectOne(`${url}/task/i-am-a-mongo-id!`);
      expect(req.request.method).toBe('GET');
    });

    it('should return a Task', () => {
      service.getTaskById('one').subscribe(base => {
        expect(base.data).toEqual({
            id: 'one',
            description: 'a cool task',
            complete: true
        });
      });

      http.expectOne(`${url}/task/one`).flush({
        data: {
          id: 'one',
          description: 'a cool task',
          complete: true
        }
      });
    });
  });

  describe('createTask', () => {
    let task;
    beforeEach(() => {
      task = new Task({
        id: 'i should not be included',
        description: 'math homework',
        complete: false
      });
    });

    it('should use /tasks', () => {
      service.createTask(task).subscribe();

      http.expectOne(`${url}/tasks`);
    });

    it('should post Task', () => {
      service.createTask(task).subscribe();

      const req = http.expectOne(`${url}/tasks`);
      expect(req.request.body).toEqual(new Task({
        id: 'i should not be included',
        description: 'math homework',
        complete: false
      }));
    });

    it('should POST', () => {
      service.createTask(task).subscribe();

      const req = http.expectOne(`${url}/tasks`);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('updateTask', () => {
    let task: Task;

    beforeEach(() => {
      task = new Task({
        id: 'i-should-be-included',
        description: 'science worksheet',
        complete: true
      });
    });

    it('should use /task/{id}', () => {
      service.updateTaskById(task).subscribe();

      http.expectOne(`${url}/task/i-should-be-included`);
    });

    it('should update Task', () => {
      service.updateTaskById(task).subscribe();

      const req = http.expectOne(`${url}/task/i-should-be-included`);
      expect(req.request.body).toEqual(new Task({
        id: 'i-should-be-included',
        description: 'science worksheet',
        complete: true
      }));
    });

    it('should PUT', () => {
      service.updateTaskById(task).subscribe();

      const req = http.expectOne(`${url}/task/i-should-be-included`);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('patchTaskById', () => {
    it('should use /task/{id}', () => {
      service.patchTaskById('anId', {newProp: true}).subscribe();

      http.expectOne(`${url}/task/anId`);
    });

    it('should PATCH', () => {
      service.patchTaskById('anId', {newProp: true}).subscribe();

      const req = http.expectOne(`${url}/task/anId`);
      expect(req.request.method).toBe('PATCH');
    });

    it('should pass new properties', () => {
      service.patchTaskById('anId', {newProp: true}).subscribe();

      const req = http.expectOne(`${url}/task/anId`);
      expect(req.request.body).toEqual({
        newProp: true
      });
    });
  });

  describe('deleteTaskById', () => {
    it('should use /task/{id}', () => {
      service.deleteTaskById('anId').subscribe();

      http.expectOne(`${url}/task/anId`);
    });

    it('should DELETE', () => {
      service.deleteTaskById('anId').subscribe();

      const req = http.expectOne(`${url}/task/anId`);
      expect(req.request.method).toBe('DELETE');
    });
  });
});
