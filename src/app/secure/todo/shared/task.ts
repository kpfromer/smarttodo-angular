export abstract class Task {
  description: string = null;
  complete: boolean = null;

  constructor(instanceData?: Task) {
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }

  abstract forSearch(): { id: string, term: string };

  asTask() {
    return {
      description: this.description,
      complete: this.complete
    };
  }

  abstract getIdentifier(): string;

  protected deserialize<T>(instanceData: T) {
    const keys = Object.keys(this);

    const unusedData = {};

    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      } else {
        throw new TypeError(`Missing a key: ${key}`);
      }
    }

    return unusedData;
  }

}
