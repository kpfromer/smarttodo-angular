import {Injectable} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import {environment} from '../../../../environments/environment';
import {Task} from './task';

const url = environment.apiUrl;

@Injectable()
export class TaskService {

  constructor(private http: AuthHttp) {
  }

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

  updateTask(task: Task) {
    return this.http.put(`https://${url}/task/${task.id}`, JSON.stringify(task));
  }

  deleteTaskById(id: string) {
    return this.http.delete(`https://${url}/task/${id}`);
  }

}
