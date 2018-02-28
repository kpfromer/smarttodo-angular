import {Component, OnInit} from '@angular/core';
import {TaskService} from '../shared/task.service';
import * as uuid from 'uuid/v4';
import {TemporaryTask} from '../shared/temporary-task';
import {Task} from '../shared/task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: Task[];

  error = false;

  constructor(private service: TaskService) {
  }

  getTasks() {
    this.service.getTasks().subscribe(
      tasks => this.tasks = tasks,
      err => this.error = true
    );
  }

  addTemporaryTask(tempTask: TemporaryTask) {
    this.tasks.push(tempTask);
  }

  createTask(task: { description: string, complete: boolean }) {
    const newTask = new TemporaryTask({
      tempId: uuid(),
      description: task.description,
      complete: task.complete
    });

    this.addTemporaryTask(newTask);

    this.service.createTask(newTask).subscribe(
      taskItem => {
        // TODO: find temp task and replace with taskItem
        // TODO: Extract into tasklistservice for Comp Sci Class
        const index = this.tasks.findIndex(
          arrayTask =>
            arrayTask instanceof TemporaryTask && arrayTask.tempId === newTask.tempId
        );

        this.tasks[index] = taskItem;
      }, // todo: get _id from backend (rename)
      err => {
        // TODO: Extract into tasklistservice for Comp Sci Class
        // TODO: store in memory
        const index = this.tasks.findIndex(arrayTask => arrayTask instanceof TemporaryTask && arrayTask.tempId === newTask.tempId);

        this.tasks.splice(index, 1);
        this.error = true;
      }
    );
  }

  ngOnInit() {
    this.getTasks();
  }

}
