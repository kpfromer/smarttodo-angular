import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../shared/auth-guard.service';
import {SecureComponent} from './secure.component';

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
          {path: 'todo', loadChildren: './todo/todo.module#TodoModule'}
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
