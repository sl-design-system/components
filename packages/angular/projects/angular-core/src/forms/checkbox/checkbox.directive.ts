import {
  Directive,
  forwardRef,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _value: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
      this.elementRef.nativeElement.checked = val;
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

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('sl-change', ['$event.target.checked'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    this.value = value;
  }
}
