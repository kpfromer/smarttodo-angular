import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss'],
})
export class UpdateTaskComponent implements OnInit {

  editDescriptionForm: FormGroup;

  @Output() onSave = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.editDescriptionForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  cancel() {
    this.onCancel.emit(true);
  }

  submit() {
    if (this.editDescriptionForm.invalid) {
      return false;
    }

    this.onSave.emit(this.editDescriptionForm.get('description').value);
  }

}
