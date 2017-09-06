import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login.component';
import {NotLoggedIn} from '../shared/not-logged-in.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [NotLoggedIn],
        component: LoginComponent
      }
    ])
  ],
  providers: [NotLoggedIn],
  exports: [
    RouterModule
  ]
})
export class LoginRoutingModule {
}
