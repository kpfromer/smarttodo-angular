import {Injectable} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import {environment} from '../../../../environments/environment';
import {Task} from './task';

const url = environment.apiUrl;

@Injectable()
export class TaskService {

  constructor(private http: AuthHttp) {
  }

  // todo: test for returns
  // todo: test for edge cases
  // todo: add edge case handling

  getTasks() {
    return this.http.get(`https://${url}/tasks`);
  }

  getTaskById(id: string) {
    return this.http.get(`https://${url}/task/${id}`);
  }

  createTask(task: {description: string, complete: boolean}) {
    return this.http.post(`https://${url}/tasks`, JSON.stringify({
      description: task.description, complete: task.complete
    }));
  }

  // todo: rename to putTask
  updateTask(task: Task) { // todo: have separate parameter for id, ID is included in JSON.stringify(task) and adding id to backend!
    return this.http.put(`https://${url}/task/${task.id}`, JSON.stringify(task));
  }

  patchTaskById(id: string, properties) {
    // todo: test
    return this.http.patch(`https://${url}/task/${id}`, JSON.stringify(properties));
  }

  deleteTaskById(id: string) {
    return this.http.delete(`https://${url}/task/${id}`);
  }

}
