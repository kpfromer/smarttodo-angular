import {Project} from './project';

export class TemporaryProject extends Project {
  tempId: string;

  constructor(project: { tempId: string, name: string, color: string }) {
    super({
      name: project.name,
      color: project.color
    });
    this.tempId = project.tempId;
  }
}
