import {
  Directive,
  forwardRef,
  ElementRef,
  HostListener, Renderer2
} from '@angular/core';
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
  selector: 'sl-radio',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioDirective),
      multi: true
    }
  ]
})
export class RadioDirective implements ControlValueAccessor, Validator {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  /** Part of Validator. */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  private validatorOnChange = () => {};

  private _initialValue: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _value: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set value(val: any) {
    // if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      // this.onTouched();
      this.elementRef.nativeElement.internals.value = this._value;
    // }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any): void {
    this._initialValue = value;
    if (value) {
      // this.elementRef.nativeElement.buttons?.forEach(radio => (radio.checked = radio.value === this.value));
      this.elementRef.nativeElement.value = this._initialValue;
      this.elementRef.nativeElement.setFormValue(value);
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

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    console.log('in registerOnValidatorChange', fn);
    this.validatorOnChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // use requiredValidator from validator??
    const nativeElement: HTMLInputElement = this.elementRef.nativeElement;
    const input: HTMLInputElement = nativeElement.querySelector('input') as HTMLInputElement;
    console.log('nativeElement in validate',this.value, control,  nativeElement, nativeElement.validity?.valid, input, control.errors, this.elementRef.nativeElement.internals); // reportValidity
    /*    if (/!*nativeElement.checkValidity()*!/ input.checkValidity()) {
          return null;
        } else {
          // return {
          //   //invalid: true
          //   invalid: control.errors
          // };
          return control.errors;
        }*/
    // return control.errors;

    console.log('in radio control status', control.valid, control, control.status, control.invalid, this.value);

    // this.#validation.validate(control.value ? this.value : undefined);

    // if (control.errors) {
    //     this.renderer.setAttribute(this.elementRef.nativeElement, 'invalid', '');
    // } else {
    //   this.renderer.removeAttribute(this.elementRef.nativeElement, 'invalid');
    // }

    // for (const validatorName in control?.errors) {
    //   console.log('validatorName in checkbox', validatorName, control.errors, control.value);
    //   if(control.touched)
    //     // return getValidatorErrorMessage(validatorName, this.control.errors[validatorName]);
    //     // this.elementRef.nativeElement.setValidity(control.errors, validatorName);
    //     this.elementRef.nativeElement.validity.validate(control.value);
    // }

    // this.#validation.validate(this.checked ? this.value : undefined);

    // this.elementRef.nativeElement.validate(control.value);

    if (/*nativeElement.checkValidity() &&*/ control.untouched || control.valid /*&& control.errors*/) {
      console.log('in radio validate if');
      //this.elementRef.nativeElement.validation.render();
      //  return {invalid: true}
      //return control.errors;
      return null;
    } else {
      console.log('in radio validate else');
      // return null;
      return control.errors;
    }

    // if (control.untouched /*&& control.pristine*/) {
    //   console.log('in input validate control untouched', control);
    //   return control.errors; // TODO: return null or not causing invalid?
    //   //return null;
    // } else {
    //   console.log('in input validate control  else', control);
    //   // this.validatorOnChange();
    //   // return control.errors;
    //   return null;
    // }

    // this.elementRef.nativeElement.setValidity(control);
    // this.elementRef.nativeElement.validity.validate(control.value/*this.value ? control.value : undefined*/);
    /*    if (control.errors) {
        for (const validatorName in control.errors) {
          console.log('validatorName in checkbox', validatorName, control.errors, control.value, control.errors[validatorName]);
          //if(control.touched)
            // return getValidatorErrorMessage(validatorName, this.control.errors[validatorName]);
            // this.elementRef.nativeElement.setValidity(control.errors, validatorName);
            // this.elementRef.nativeElement.validity.validate(control.value);
            // this.elementRef.nativeElement.internals.validity.validate(control.value);
          // this.elementRef.nativeElement.validity.validate(control.value/!*this.value ? control.value : undefined*!/);
          // this.#validation.validate(this.checked ? this.value : undefined);
          // return control.errors;
          // return {invalid: true}
          return control.errors; //{validatorName: true};
        }
        return {invalid: true};
        } else {
          return null;
        }*/

    //  console.log('control.value in checkbox', control.value, control.errors);

    // return control.errors; // TODO: changing value is not reflecting


    // if (this.elementRef.nativeElement.checkValidity() && control.errors) {
    //   console.log('in checkbox validate if');
    //   return {invalid: true}
    // } else {
    //   console.log('in checkbox validate else');
    //   return null;
    // }
  }

  constructor(/*private*/ public elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event.target'])
  @HostListener('keydown', ['$event.target'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    console.log('value in click radiogroup', value.value);
    this.value = value.value;
    this.elementRef.nativeElement.checked = value.checked;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
