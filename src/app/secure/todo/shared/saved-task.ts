import {Task} from './task';

export class SavedTask extends Task {
  readonly _id: string;

  constructor(task: { _id: string, description: string, complete: boolean }) {
    super({
      description: task.description,
      complete: task.complete
    });
    this._id = task._id;
  }
}
