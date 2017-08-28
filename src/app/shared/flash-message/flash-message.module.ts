import {NgModule} from '@angular/core';
import {FlashMessageComponent} from './flash-message.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [FlashMessageComponent],
  exports: [FlashMessageComponent]
})
export class FlashMessageModule { }
