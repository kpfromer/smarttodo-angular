import {Project} from './project';

export class SavedProject extends Project {
  _id: string;

  constructor(project: { _id: string, name: string, color: string }) {
    super({
      name: project.name,
      color: project.color
    });
    this._id = project._id;
  }
}
