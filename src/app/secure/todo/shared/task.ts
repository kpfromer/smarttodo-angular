export class Task {
  id: string;
  description: string;
  complete: boolean;

  constructor(id: string, description: string, complete: boolean) {
    this.id = id;
    this.description = description;
    this.complete = complete;
  }
}
