import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineEditorComponent} from './inline-editor.component';
import {FormsModule} from '@angular/forms';
import {FocusModule} from 'angular2-focus/src/focus.module';

@NgModule({
  imports: [
    CommonModule,
    FocusModule.forRoot(),
    FormsModule
  ],
  declarations: [InlineEditorComponent],
  exports: [InlineEditorComponent]
})
export class InlineEditorModule { }
