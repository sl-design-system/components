import {Directive, ElementRef, forwardRef, HostListener, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import '@sanomalearning/slds-core/input/register.js';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDirective),
      multi: true
    }
  ]
})

export class InputDirective implements ControlValueAccessor {
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
      this._value = val;
      //this.onChange(this._value);
      this.onTouched();
      console.log('val', val);
      // this.elementRef.nativeElement.value = val;
      this.elementRef.nativeElement.value = val;
    }
  }

  writeValue(value: any): void {
    console.log('writeValue', value, this.elementRef.nativeElement.value);
    if (value) {
      this.value = value;
      //this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
      // this.elementRef.nativeElement.value = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    console.log('register onChange', fn);
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    console.log('elementRef', this._value,  elementRef, this.elementRef.nativeElement.value, this.elementRef.nativeElement, this.elementRef.nativeElement.value);
    console.log('elementRef value 2', (this.elementRef.nativeElement.input as HTMLInputElement), /*TODO:  it does not see value field*/ this.elementRef.nativeElement.input.validity);
    console.log('this.elementRef.nativeElement.input', this.elementRef.nativeElement.input, this.elementRef.nativeElement.input.value);
    // debugger;
  }

  @HostListener('valueChange', ['$event.detail'])
  listenForValueChange(value: any): void {
    console.log('on change', value);
    this.value = value;
  }

  // @HostListener('change')
  // onChange(value: string): void {
  //   console.log('inside onChange', value);
  //   this.value = value;
  //   // this.writeValue(value);
  //   //this.elementRef.nativeElement.value = value;
  // }
}
