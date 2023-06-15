import {Directive, ElementRef, forwardRef, HostListener, Renderer2} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {ValidationController} from "@sl-design-system/shared";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-text-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputDirective),
      multi: true
    }
  ]
})

export class InputDirective implements ControlValueAccessor, Validator {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  /** Part of Validator. */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  private validatorOnChange = () => {};

  /** The combined form control validator for this input. */
  // private validator: ValidatorFn | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _value: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set value(val: any) {
    console.log('val in set value', val, this.value, this.elementRef.nativeElement.input.value, this._value);
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
      this.elementRef.nativeElement.input.value = val;
    }
    console.log('val in set value after if', val, this.value, this.elementRef.nativeElement.input.value, this._value);
  }

  #validation = new ValidationController(this.elementRef.nativeElement, {
    target: () => this.elementRef.nativeElement.querySelector('input') as HTMLInputElement
  });

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    console.log('in registerOnValidatorChange', fn);
    this.validatorOnChange = fn;
  }

  /** Implemented as part of Validator. */
  // validate(c: AbstractControl): ValidationErrors | null {
  //   console.log('c in validate', c);
  //   return this.validator ? this.validator(c) : null;
  // }

  validate(control: AbstractControl): ValidationErrors | null {
    const nativeElement: HTMLInputElement = this.elementRef.nativeElement;
    const input: HTMLInputElement = nativeElement.querySelector('input') as HTMLInputElement;
    console.log('nativeElement in validate',control, control.status, nativeElement, nativeElement.validity?.valid, input, control.errors, this.elementRef.nativeElement.validity); // reportValidity
    //console.log('nativeElement in validate',this.value, control,  nativeElement, nativeElement.validity?.valid, input, control.errors, this.elementRef.nativeElement.internals); // reportValidity

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

    // this.elementRef.nativeElement.setValidity(control);

    // for (const validatorName in control?.errors) {
    //   console.log('validatorName in input', validatorName, control.errors, control.value);
    //   if(control.touched)
    //     // return getValidatorErrorMessage(validatorName, this.control.errors[validatorName]);
    //     // this.elementRef.nativeElement.setValidity(control.errors, validatorName);
    //   this.elementRef.nativeElement.validate(control.value);
    // }

   // control.setErrors()

    // if (control.invalid) {
    //   this.renderer.setAttribute(this.elementRef.nativeElement, 'invalid', '');
    // } else {
    //   this.renderer.removeAttribute(this.elementRef.nativeElement, 'invalid');
    // }

    // this.#validation.validate(control.value); // TODO: necessary?

    // this.#validation.render();

    if (input.checkValidity() /*&& control.errors*/) { // TODO: working only on required, not minlength etc.
      console.log('in input validate if');
       // return {invalid: true}
      return null;
      // return control.errors;
    } else {
      console.log('in input validate else');
      // return null;
      // return {invalid: true}
      return control.errors;
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
    console.log('register on change input', fn);
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // setDisabledState(isDisabled: boolean): void {
  //   this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  // }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    // this.validator = Validators.compose(null);
    // this.validator = Validators.compose([this.parseValidator/*, this.minValidator, this.maxValidator, this.filterValidator*/]);
  }

  // TODO: register icon separately? necessary to add import

  @HostListener('input', ['$event.target.value'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    console.log('input event on input', value);
    this.value = value;
    // this.validatorOnChange();

    console.log('this.elementRef.nativeElement.validators', this.elementRef.nativeElement.validators, this.elementRef.nativeElement, this.elementRef.nativeElement.valid);
  }

  // parseValidator: ValidatorFn = (): ValidationErrors | null => {
  //   return this.value ? null : { inputParse: { text: this.elementRef.nativeElement.value } };
  // }

  // ValidateUrl(control: AbstractControl): ValidationErrors | null {
  //   if (!control.value.startsWith('https') || !control.value.includes('.io')) {
  //     return { invalidUrl: true };
  //   }
  //   return null;
  // }
}

// export function ValidateUrl(control: AbstractControl) {
//   if (!control.value.startsWith('https') || !control.value.includes('.io')) {
//     return { invalidUrl: true };
//   }
//   return null;
// }
