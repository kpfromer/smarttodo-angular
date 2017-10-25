import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  @Output() onError = new EventEmitter<Error | HttpErrorResponse>();

  constructor(private service: TaskService) {
  }

  click(checked: boolean) {
    this.task.complete = checked;
    this.service.patchTaskById(this.task.id, {complete: checked}).subscribe(res => {
      if (res.status !== 200) this.onError.emit(new Error(res.statusText));
    }, (err: HttpErrorResponse) => this.onError.emit(err));
  }

  updateDescription(description: string) {
    this.service.patchTaskById(this.task.id, {description}).subscribe(res => {
      if (res.status !== 200) this.onError.emit(new Error(res.statusText));
    }, (err: HttpErrorResponse) => this.onError.emit(err));
  }

  ngOnInit() {
  }

}
