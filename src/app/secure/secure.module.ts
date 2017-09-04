import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SecureRoutingModule} from './secure.routing';
import {SecureComponent} from './secure.component';
import {LogoutComponent} from './logout/logout.component';

@NgModule({
  imports: [
    CommonModule,
    SecureRoutingModule
  ],
  declarations: [
    SecureComponent,
    LogoutComponent
  ]
})
export class SecureModule {
}
