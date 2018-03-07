import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Project} from '../shared/project';
import {SavedProject} from '../shared/saved-project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  @Output() onProjectChange = new EventEmitter<SavedProject>();

  // TODO: remove add and replace with projectservice
  projects: Project[] = [
    {
      name: 'test',
      color: 'ff3b5b'
    } as Project,
    {
      name: 'hello world',
      color: '4cffff'
    } as Project
  ];

  constructor() {
  }

  // TODO: change tasks based on project
  changeProject(project: Project) {
    if (project instanceof SavedProject) {
      this.onProjectChange.emit(project);
    } else {
      // TODO: add if not saved project! error?
    }
  }

  ngOnInit() {
  }

}
