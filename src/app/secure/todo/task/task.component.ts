import {Component, Input, OnInit} from '@angular/core';
import {Task} from '../shared/task';
import {TaskService} from '../shared/task.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
  task: Task;

  constructor(private service: TaskService) {
  }

  click(checked: boolean) {
    this.task.complete = checked;
    this.service.patchTaskById(this.task.id, {complete: checked}).subscribe(res => {
      // todo: should this fail silently?
    }, (err: HttpErrorResponse) => {
      // todo: should this fail silently?
    });
  }

  ngOnInit() {
  }

}
