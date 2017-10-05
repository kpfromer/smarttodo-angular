import {Component, OnInit} from '@angular/core';
import {Task} from '../shared/task';
import {TaskService} from '../shared/task.service';
import * as uuid from 'uuid/v4';
import {HttpErrorResponse} from '@angular/common/http';

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
    this.service.getTasks().subscribe(res => {
      if (res.status === 200) {
        const base = res.json();
        this.tasks = base.data as Task[];
      } else
        this.error = true;
    }, (err: HttpErrorResponse) => this.error = true);
  }


  createTask(task: {description: string, complete: boolean}) {
    const newTask = new Task({
      id: uuid(),
      description: task.description,
      complete: task.complete
    });

    this.tasks.push(newTask);

    this.service.createTask(newTask).subscribe(res => {
      if (res.status !== 200)
        this.error = true;
    }, (err: HttpErrorResponse) => this.error = true);
  }

  ngOnInit() {
    this.getTasks();
  }

}
