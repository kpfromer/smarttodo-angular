import {Component, OnInit} from '@angular/core';
import {Task} from '../shared/task';
import {TaskService} from '../shared/task.service';
import * as uuid from 'uuid/v4';

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


  createTask(task: {description: string, complete: boolean}) {
    const newTask = new Task({
      id: uuid(), // todo: get id from backend
      description: task.description,
      complete: task.complete
    });

    this.tasks.push(newTask);

    this.service.createTask(newTask).subscribe(
      taskItem => {
      }, // todo: get id from backend (rename)
      err => this.error = true
    );
  }

  ngOnInit() {
    this.getTasks();
  }

}
