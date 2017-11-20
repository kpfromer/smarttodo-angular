import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Task} from './task';
import {HttpClient} from '@angular/common/http';
import {Data} from '@angular/router';

const url = environment.apiUrl;

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  // todo: test for returns
  // todo: test for edge cases
  // todo: add edge case handling

  getTasks() {
    return this.http.get<Data>(`https://${url}/tasks`);
  }

  getTaskById(id: string) {
    return this.http.get<Data>(`https://${url}/task/${id}`);
  }

  createTask(task: Task) {
    return this.http.post<Data>(`https://${url}/tasks`, JSON.stringify(task));
  }

  updateTaskById(id: string, task: Task) {
    delete task.id;
    return this.http.put<Data>(`https://${url}/task/${id}`, JSON.stringify(task));
  }

  patchTaskById(id: string, properties) { // todo: remove?
    return this.http.patch<Data>(`https://${url}/task/${id}`, JSON.stringify(properties));
  }

  deleteTaskById(id: string) {
    return this.http.delete<Data>(`https://${url}/task/${id}`);
  }

  private handleError() {
  } // todo

}
