import {Task} from './task';

export class SavedTask extends Task {
  readonly _id: string = null;

  constructor(instanceData: SavedTask) {
    super();
    this.deserialize(instanceData);
  }

  forSearch(): { id: string; term: string } {
    return {
      id: this._id,
      term: this.description
    };
  }

  getIdentifier() {
    return this._id;
  }
}
