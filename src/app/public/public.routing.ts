import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PublicComponent} from './public.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PublicComponent,
        children: [
          {path: '', redirectTo: 'home', pathMatch: 'full'},
          {path: 'home', loadChildren: './home/home.module#HomeModule'},
          {path: 'login', loadChildren: './login/login.module#LoginModule'}
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PublicRoutingModule {
}
