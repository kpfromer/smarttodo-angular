import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {SavedTask} from './saved-task';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Task} from './task';

const url = environment.apiUrl;

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  // todo: test for edge cases
  // todo: add edge case handling

  getTasks(): Observable<SavedTask[]> {
    return this.http.get<SavedTask[]>(`${url}/task`);
  }

  getTaskById(id: string): Observable<SavedTask> {
    return this.http.get<SavedTask>(`${url}/task/${id}`);
  }

  createTask(task: Task): Observable<SavedTask> {
    console.log(task.asTask());
    return this.http.post<SavedTask>(`${url}/task`, task.asTask());
  }

  updateTaskById(task: SavedTask): Observable<SavedTask> {
    return this.http.put<SavedTask>(`${url}/task/${task._id}`, task);
  }

  patchTaskById(id: string, properties): Observable<SavedTask> { // todo: remove?
    return this.http.patch<SavedTask>(`${url}/task/${id}`, properties);
  }

  deleteTaskById(id: string) {
    return this.http.delete(`${url}/task/${id}`);
  }

  private handleError() {
  } // todo

}
