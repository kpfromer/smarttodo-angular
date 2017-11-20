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
    return this.http.get<Data>(`${url}/tasks`);
  }

  getTaskById(id: string) {
    return this.http.get<Data>(`${url}/task/${id}`);
  }

  createTask(task: Task) {
    return this.http.post<Data>(`${url}/tasks`, task);
  }

  updateTaskById(task: Task) {
    return this.http.put<Data>(`${url}/task/${task.id}`, task);
  }

  patchTaskById(id: string, properties) { // todo: remove?
    return this.http.patch<Data>(`${url}/task/${id}`, properties);
  }

  deleteTaskById(id: string) {
    return this.http.delete<Data>(`${url}/task/${id}`);
  }

  private handleError() {
  } // todo

}
