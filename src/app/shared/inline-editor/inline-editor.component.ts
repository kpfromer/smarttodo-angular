import {Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/*
* We also have to use useExisting because CounterInputComponent will be
* already created as a directive dependency in the component that uses it.
* If we don’t do that, we get a new instance as this is how DI in Angular works.
* */
const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineEditorComponent), // forwardRef gets InlineEditorComponent once it is instantiated (which we see below)
  multi: true
};

@Component({
  selector: 'app-inline-editor',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.css'],
  providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR]
})
export class InlineEditorComponent implements OnInit, ControlValueAccessor {

  @ViewChild('inlineEditControl') inlineEditControl: ElementRef;
  @Output() onSave = new EventEmitter<{ input: any }>();
  @Input() required = false;
  @Input() disabled = false;
  public onChange = (_: any) => {
  };
  private _pastValue: any = '';

  constructor() {
  }

  private _type = 'text';

  get type(): string {
    return this._type;
  }

  @Input()
  set type(newType: string) {
    if (newType === 'password') throw new Error('Type cannot be password');
    this._type = newType;
  }

  private _value: any = '';

  get value(): any {
    return this._value;
  }

  set value(newValue: any) {
    if (this.disabled) return;

    if (this._value !== newValue) {
      this._value = newValue;
      this.onChange(this._value);
    }
  }

  private _editing = false;

  get editing(): boolean {
    return this._editing;
  }

  /*
  *  writeValue is the method that writes a new value from the form model into the view or (if needed) DOM property.
  *  This is where we want to update our counterValue model, as that’s the thing that is used in the view.
  * */
  writeValue(obj: any): void {
    this.value = obj;
  }

  /*
  * registerOnChange is a method that registers a handler that should be called when something in the view has changed.
  * It gets a function that tells other form directives and form controls to update their values.
  * In other words, that’s the handler function we want to call whenever counterValue changes through the view.
  * */
  public registerOnChange(fn: (value: any) => {}): void {
    this.onChange = fn;
  }

  /*
  * Similar to registerOnChange(), this registers a handler specifically for when a control receives a touch event.
  * */
  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  cancelEditing() {
    if (this.disabled) return;

    this.value = this._pastValue;

    this._editing = false;
  }

  doneEditing() {
    if (this.disabled || !this.value) return;

    this._editing = false;

    this.onSave.emit({input: this.value});
  }

  // Start the editing process for the input element
  startEditing() {
    if (this.disabled) return;

    this._pastValue = this.value;
    this._editing = true;
  }

  ngOnInit() {
  }

}
