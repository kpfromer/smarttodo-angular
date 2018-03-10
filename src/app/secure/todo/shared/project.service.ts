import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {SavedProject} from './saved-project';
import {Project} from './project';

@Injectable()
export class ProjectService {

  constructor(private http: HttpClient) {
  }

  getProjects(): Observable<SavedProject[]> {
    return this.http.get<SavedProject[]>(`/project`);
  }

  getProjectById(id: string): Observable<SavedProject> {
    return this.http.get<SavedProject>(`/project/${id}`);
  }

  createProject(project: Project): Observable<SavedProject> {
    return this.http.post<SavedProject>(`/project`, project.asProject());
  }

  updateProjectById(project: SavedProject): Observable<SavedProject> {
    return this.http.put<SavedProject>(`/project/${project._id}`, project.asProject());
  }

  patchProjectById(id: string, properties): Observable<SavedProject> { // todo: remove?
    return this.http.patch<SavedProject>(`/project/${id}`, properties);
  }

  deleteProjectById(id: string) {
    return this.http.delete(`/project/${id}`);
  }

  private handleError() {
  } // todo

}
