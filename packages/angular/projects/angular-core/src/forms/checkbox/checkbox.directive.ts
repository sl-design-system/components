import {
  Directive,
  forwardRef,
  ElementRef,
  HostListener, Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import '@sanomalearning/slds-core/checkbox/register.js';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-checkbox',
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

  private _value: any;

  get value() {
    return this._value;
  }

  set value(val: any) {
    if (val !== this._value) {
      console.log('val in set value checkbox', val);
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
      this.elementRef.nativeElement.checked = val;
      // this.elementRef.nativeElement.input.value = val;
      // this.elementRef.nativeElement.textarea.value = val;
    }
  }

  writeValue(value: any) {
    console.log('writeValue checkbox', value);
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
    console.log('elementRef checkbox', elementRef, this.elementRef.nativeElement.checked );
  }

  @HostListener('sl-change', ['$event.target.checked'])
  listenForValueChange(value: any) {
    this.value = value;
    console.log('checkbox value in listenForValueChange', value);
  }
}
