import {Task} from './task';

export class TemporaryTask extends Task {
  tempId: string;

  constructor(task: { tempId: string, description: string, complete: boolean }) {
    super({
      description: task.description,
      complete: task.complete
    });

    this.tempId = task.tempId;
  }
}
