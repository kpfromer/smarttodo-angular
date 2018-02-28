export abstract class Task {
  description: string;
  complete: boolean;

  constructor(task: { description: string, complete: boolean }) {
    this.description = task.description;
    this.complete = task.complete;
  }

  asTask() {
    return {
      description: this.description,
      complete: this.complete
    };
  }
}
