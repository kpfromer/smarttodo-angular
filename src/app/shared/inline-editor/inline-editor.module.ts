import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineEditorComponent} from './inline-editor.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [InlineEditorComponent],
  exports: [InlineEditorComponent]
})
export class InlineEditorModule { }
