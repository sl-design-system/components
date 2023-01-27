import {
  Directive,
  forwardRef,
  ElementRef,
  HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import '@sanomalearning/slds-core/checkbox/register.js';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sla-checkbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxDirective),
      multi: true
    }
  ]
})
export class CheckboxDirective implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void = () => {};
  //onChange: unknown = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  private _value: unknown;

  get value() {
    return this._value;
  }

  set value(val: unknown) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
      // this.elementRef.nativeElement.value = val;
      this.elementRef.nativeElement.input.value = val;
    }
  }

  writeValue(value: unknown) {
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

  constructor(private elementRef: ElementRef) {
    console.log('elementRef checkbox', elementRef, this.elementRef.nativeElement.value );
  }

  @HostListener('valueChange', ['$event.detail'])
  listenForValueChange(value: unknown) {
    this.value = value;
    console.log('value in listenForValueChange', value);
  }
}
