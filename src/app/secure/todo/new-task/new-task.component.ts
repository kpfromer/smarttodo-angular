import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  newTaskForm: FormGroup;

  @Output() onCreate = new EventEmitter<{
    description: string,
    complete: boolean
  }>();

  constructor(private formBuilder: FormBuilder) {
  }

  createTask(description: string) {
    this.newTaskForm.reset();
    this.newTaskForm.get('description').setErrors({});

    this.onCreate.emit({
      description,
      complete: false
    });
  }

  ngOnInit() {
    this.newTaskForm = this.formBuilder.group({
      description: [null, Validators.required]
    });
  }

}
