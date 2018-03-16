import {Injectable} from '@angular/core';
import {SavedTask} from './saved-task';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Task} from './task';

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) {
  }

  // todo: test for edge cases
  // todo: add edge case handling

  getTasks(): Observable<SavedTask[]> {
    return this.http.get<SavedTask[]>(`/task`);
  }

  getTaskById(id: string): Observable<SavedTask> {
    return this.http.get<SavedTask>(`/task/${id}`);
  }

  createTask(task: Task): Observable<SavedTask> {
    return this.http.post<SavedTask>(`/task`, task.asTask());
  }

  updateTaskById(task: SavedTask): Observable<SavedTask> {
    return this.http.put<SavedTask>(`/task/${task._id}`, task);
  }

  patchTaskById(id: string, properties): Observable<SavedTask> { // todo: remove?
    return this.http.patch<SavedTask>(`/task/${id}`, properties);
  }

  deleteTaskById(id: string) {
    return this.http.delete(`/task/${id}`);
  }

  private handleError() {
  } // todo

}
