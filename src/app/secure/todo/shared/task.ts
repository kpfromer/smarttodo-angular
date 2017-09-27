export class Task {
  id: string;
  description: string;
  complete: boolean;

  constructor(task: {id: string, description: string, complete: boolean}) {
    this.id = task.id;
    this.description = task.description;
    this.complete = task.complete;
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      complete: this.complete
    };
  }
}
