import {
  Directive,
  forwardRef,
  ElementRef,
  HostListener, Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import '@sanomalearning/slds-core/radio-group/register.js';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-radio-group',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupDirective),
      multi: true
    }
  ]
})
export class RadioGroupDirective implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void = () => {};
  //onChange: unknown = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  private _value: any;

  get value() {
    return this._value;
  }

  set value(val: any) {
    if (val !== this._value) {
      console.log('val in set value radio group', val);
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
      // this.elementRef.nativeElement.checked = val;
      // this.elementRef.nativeElement.input.value = val;
      // this.elementRef.nativeElement.textarea.value = val;
    }
  }

  writeValue(value: any) {
    console.log('writeValue radio', value);
    // this.renderer.setAttribute(this.elementRef.nativeElement, 'checked', value);
    if (value) {
      this.value = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    console.log('elementRef radio', elementRef, this.elementRef.nativeElement.checked );
  }

  @HostListener('click', ['$event.target'])
  @HostListener('keydown', ['$event.target'])
  listenForValueChange(value: any) {
    this.value = value;
    //this.value = value.value;
    //this.elementRef.nativeElement.checked = value.checked;
    console.log('radio group value in listenForValueChange', value);
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('radio group disabled', isDisabled);
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
