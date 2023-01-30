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
  selector: 'sl-radio',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioDirective),
      multi: true
    }
  ]
})
export class RadioDirective implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void = () => {};
  //onChange: unknown = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  private _value: any;

  private _disabled = false;

  get value() {
    return this._value;
  }

  set value(val: any) {
    if (val !== this._value) {
      console.log('val in set value radio', val);
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
      // this.elementRef.nativeElement.checked = val;
      // this.elementRef.nativeElement.input.value = val;
      // this.elementRef.nativeElement.textarea.value = val;
    }
  }

  // get disabled() {
  //   return this._disabled;
  // }
  //
  // set disabled(value: any) {
  //   const newValue = !!value;
  //   const element = this.elementRef.nativeElement;
  //
  //   if (this._disabled !== newValue) {
  //     this._disabled = newValue;
  //     //this.disabledChange.emit(newValue);
  //   }
  //
  //   if (newValue && element.blur) {
  //     element.blur();
  //   }
  // }

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
    this.value = value.value;
    this.elementRef.nativeElement.checked = value.checked;
    console.log('radio value in listenForValueChange', value, value.value, value.checked, this.value);
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('radio disabled', isDisabled);
    // this.disabled = isDisabled;
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
