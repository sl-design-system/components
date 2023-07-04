import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-textarea',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextareaDirective),
      multi: true
    }
  ]
})

export class TextareaDirective implements ControlValueAccessor, Validator {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  /** Part of Validator. */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  private validatorOnChange = () => {};

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
      this.elementRef.nativeElement.textarea.value = val;
      this.onChange(this._value);
      //this.onTouched();
      this.validatorOnChange();
    }
  }

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    this.validatorOnChange = fn;
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

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const nativeElement: HTMLInputElement = this.elementRef.nativeElement;
    const input: HTMLInputElement = nativeElement.querySelector('input') as HTMLInputElement;
    console.log('nativeElement in validate',control, control.status, nativeElement, nativeElement.validity?.valid, input, control.errors, this.elementRef.nativeElement.validity); // reportValidity


    // TODO: if when updateon change / submit/ blur?

   // console.log('control touched -------->>>>>>>', control, control.touched, control.valid, input.validationMessage/*, (control.parent as NgForm).submitted*/ /*, input.reportValidity()*/);


    console.log('in input validate control controlll', control, control.untouched);

    if (control.untouched /*&& control.pristine*/) {
      console.log('in input validate control untouched', control);
      return control.errors; // TODO: return null or not causing invalid?
      //return null;
    } else {
      console.log('in input validate control  else', control);
      // this.validatorOnChange();
      // return control.errors;
      return null;
    }

  }

  constructor(private elementRef: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    this.value = value;
  }
}
