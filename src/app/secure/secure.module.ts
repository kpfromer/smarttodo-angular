import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SecureRoutingModule} from './secure.routing';
import {SecureComponent} from './secure.component';

@NgModule({
  imports: [
    CommonModule,
    SecureRoutingModule
  ],
  declarations: [
    SecureComponent
  ]
})
export class SecureModule {
}
