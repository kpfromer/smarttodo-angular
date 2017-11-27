import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Task} from './task';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const url = environment.apiUrl;

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  // todo: test for returns
  // todo: test for edge cases
  // todo: add edge case handling

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${url}/tasks`);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${url}/task/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${url}/tasks`, task);
  }

  updateTaskById(task: Task): Observable<Task> {
    return this.http.put<Task>(`${url}/task/${task.id}`, task);
  }

  patchTaskById(id: string, properties): Observable<Task> { // todo: remove?
    return this.http.patch<Task>(`${url}/task/${id}`, properties);
  }

  deleteTaskById(id: string) {
    return this.http.delete(`${url}/task/${id}`);
  }

  private handleError() {
  } // todo

}
