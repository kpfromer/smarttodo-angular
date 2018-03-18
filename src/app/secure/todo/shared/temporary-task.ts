import {Task} from './task';

export class TemporaryTask extends Task {
  tempId: string = null;

  constructor(instanceData: TemporaryTask) {
    super();
    this.deserialize<TemporaryTask>(instanceData);
  }

  forSearch(): { id: string; term: string } {
    return {
      id: this.tempId,
      term: this.description
    };
  }

  getIdentifier() {
    return this.tempId;
  }
}
