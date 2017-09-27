import {TestBed} from '@angular/core/testing';

import {TaskService} from './task.service';
import {AuthHttp} from 'angular2-jwt';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {BaseRequestOptions, Http, HttpModule, RequestMethod, Response, ResponseOptions} from '@angular/http';
import {Task} from './task';

describe('TaskService', () => {

  let service: TaskService;
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        TaskService,
        {
          provide: AuthHttp,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        },
        MockBackend,
        BaseRequestOptions
      ]
    });
    service = TestBed.get(TaskService);
    mockBackend = TestBed.get(MockBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should use https', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.startsWith('https://')).toBe(true);
      });
      service.getTasks();
    });

    it('should use /tasks', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.endsWith('/tasks')).toBe(true);
      });
      service.getTasks();
    });

    it('should GET', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
      });
      service.getTasks();
    });

    it('should return a list of Tasks', () => {

      const responseOptions = new ResponseOptions({
        body: JSON.stringify({
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
        })
      });

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(responseOptions));
      });
      service.getTasks()
        .map(data => data.json())
        .subscribe(base => {
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
    });
  });

  describe('getTaskById', () => {
    it('should use https', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.startsWith('https://')).toBe(true);
      });
      service.getTaskById('i-am-a-mongo-id!');
    });

    it('should use /task/{id}', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.endsWith('/task/i-am-a-mongo-id!')).toBe(true);
      });
      service.getTaskById('i-am-a-mongo-id!');
    });

    it('should GET', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Get);
      });
      service.getTaskById('i-am-a-mongo-id!');
    });

    it('should return a Task', () => {
      const responseOptions = new ResponseOptions({
        body: JSON.stringify({
          data: {
            id: 'one',
            description: 'a cool task',
            complete: true
          }
        })
      });

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(responseOptions));
      });

      service.getTasks()
        .map(data => data.json())
        .subscribe(base => {
          expect(base.data).toEqual({
            id: 'one',
            description: 'a cool task',
            complete: true
          });
        });
    });
  });

  describe('createTask', () => {
    let task;
    beforeEach(() => {
      task = {
        id: 'i should not be included',
        description: 'math homework',
        complete: false
      };
    });
    it('should use https', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.startsWith('https://')).toBe(true);
      });

      service.createTask(task);
    });

    it('should use /tasks', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.endsWith('/tasks')).toBe(true);
      });

      service.createTask(task);
    });

    it('should post Task', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const body = JSON.parse(connection.request.getBody());
        expect(body.id).toBeUndefined();
        expect(body.description).toBe('math homework');
        expect(body.complete).toBe(false);
      });

      service.createTask(task);
    });

    it('should POST', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Post);
      });

      service.createTask(task);
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
    it('should use https', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.startsWith('https://')).toBe(true);
      });

      service.updateTask(task);
    });

    it('should use /task/{id}', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.endsWith('/task/i-should-be-included')).toBe(true);
      });

      service.updateTask(task);
    });

    it('should post Task', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const body = JSON.parse(connection.request.getBody());
        expect(body.id).toBe('i-should-be-included');
        expect(body.description).toBe('science worksheet');
        expect(body.complete).toBe(true);
      });

      service.updateTask(task);
    });

    it('should POST', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Put);
      });

      service.updateTask(task);
    });
  });

  describe('deleteTaskById', () => {
    it('should use https', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.startsWith('https://')).toBe(true);
      });

      service.deleteTaskById('anId');
    });

    it('should use /task/{id}', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url.endsWith('/task/anId')).toBe(true);
      });

      service.deleteTaskById('anId');
    });

    it('should DELETE', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Delete);
      });

      service.deleteTaskById('anId');
    });
  });

});
