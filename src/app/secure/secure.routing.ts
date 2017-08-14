import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../shared/auth-guard.service';
import {SecureComponent} from './secure.component';
import {TodoModule} from './todo/todo.module';

export function exportTodoModule() {
  return TodoModule;
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SecureComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
          {path: '', redirectTo: 'todo', pathMatch: 'full'},
          {path: 'todo', loadChildren: exportTodoModule}
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SecureRoutingModule {
}
