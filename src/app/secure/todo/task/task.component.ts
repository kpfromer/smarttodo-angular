import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SavedTask} from '../shared/saved-task';
import {TaskService} from '../shared/task.service';
import {HttpErrorResponse} from '@angular/common/http';
import {SatPopover} from '@ncstate/sat-popover';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input()
  task: SavedTask;

  @Output() onError = new EventEmitter<Error | HttpErrorResponse>();

  @ViewChild('popup') popup: SatPopover;

  constructor(private service: TaskService) {
  }

  click(checked: boolean) {
    this.task.complete = checked;
    this.service.patchTaskById(this.task._id, {complete: checked}).subscribe(
      task => {
      },
      err => this.onError.emit(err)
    );
  }

  updateDescription(description: string) {
    this.service.patchTaskById(this.task._id, {description}).subscribe(
      task => {
      },
      err => this.onError.emit(err)
    );
  }

  startEditing() {
    this.popup.open();
    return true;
  }

  doneEditing() {
    this.popup.close();
    return true;
  }

  ngOnInit() {
  }

}
