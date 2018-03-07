export abstract class Project {
  name: string;
  color: string;

  constructor(project: { name: string, color: string }) {
    this.name = project.name;
    this.color = project.color;
  }

  asProject() {
    return {
      name: this.name,
      color: this.color
    };
  }
}
