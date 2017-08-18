import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodoRoutingModule} from './todo.routing';
import {TodoComponent} from './todo.component';
import {TaskComponent} from './task/task.component';
import {TaskListComponent} from './task-list/task-list.component';
import {TaskService} from './shared/task.service';

@NgModule({
  imports: [
    CommonModule,
    TodoRoutingModule
  ],
  declarations: [
    TaskComponent,
    TaskListComponent,
    TodoComponent
  ],
  providers: [
    TaskService
  ]
})
export class TodoModule {
}
