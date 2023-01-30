import {Directive, ElementRef, forwardRef, HostListener, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import '@sanomalearning/slds-core/textarea/register.js';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-textarea',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaDirective),
      multi: true
    }
  ]
})

export class TextareaDirective implements ControlValueAccessor {
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
      this.onChange(this._value);
      this.onTouched();
      console.log('val', val);
      // this.elementRef.nativeElement.value = val;
      //this.elementRef.nativeElement.value = val;
      this.elementRef.nativeElement.textarea.value = val;
    }
  }

  writeValue(value: any): void {
    console.log('writeValue textarea', value, this.elementRef.nativeElement.value);
    if (value) {
      this.value = value;
      //this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
      // this.elementRef.nativeElement.value = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    console.log('register onChange textarea', fn);
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    console.log('txtarea elementRef', this._value,  elementRef, this.elementRef.nativeElement.value, this.elementRef.nativeElement, this.elementRef.nativeElement.value);
    // console.log('txtarea elementRef value 2', (this.elementRef.nativeElement.input as HTMLInputElement)?.value, /*TODO:  it does not see value field*/ this.elementRef.nativeElement.input.validity);
    console.log('txtarea this.elementRef.nativeElement.input', this.elementRef.nativeElement.input, this.elementRef.nativeElement.input?.value);
    console.log('txtarea element input3', this.elementRef.nativeElement.input);
    // debugger;
  }

  @HostListener('input', ['$event.target.value'])
  listenForValueChange(value: any): void {
    console.log('txtarea on change', value);
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
