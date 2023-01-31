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
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _value: any;

  get value() {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event.target'])
  @HostListener('keydown', ['$event.target'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
