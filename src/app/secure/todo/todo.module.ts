import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodoRoutingModule} from './todo.routing';
import {TodoComponent} from './todo.component';
import {TaskComponent} from './task/task.component';
import {TaskListComponent} from './task-list/task-list.component';
import {TaskService} from './shared/task.service';
import {NewTaskComponent} from './new-task/new-task.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InlineEditorModule} from '../../shared/inline-editor/inline-editor.module';
import {FlashMessageModule} from '../../shared/flash-message/flash-message.module';
import {MatCheckboxModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineEditorModule,
    TodoRoutingModule,
    FlashMessageModule,
    MatCheckboxModule
  ],
  declarations: [
    TaskComponent,
    TaskListComponent,
    TodoComponent,
    NewTaskComponent
  ],
  providers: [
    TaskService
  ]
})
export class TodoModule {
}
