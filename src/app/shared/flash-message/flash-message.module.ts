import {NgModule} from '@angular/core';
import {FlashMessageComponent} from './flash-message.component';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [FlashMessageComponent],
  exports: [FlashMessageComponent]
})
export class FlashMessageModule { }
