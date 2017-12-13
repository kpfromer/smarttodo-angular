import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login.routing';
import {FlashMessageModule} from '../../shared/flash-message/flash-message.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessageModule,
    MatInputModule,
    MatButtonModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {
}
