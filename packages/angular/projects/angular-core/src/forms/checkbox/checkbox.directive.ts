import {
  Directive,
  forwardRef,
  ElementRef,
  HostListener, HostBinding, Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, NgModel,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {requiredValidator, ValidationController} from "@sl-design-system/shared";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-checkbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxDirective),
      multi: true
    }
  ]
})
export class CheckboxDirective implements ControlValueAccessor, Validator {
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
    console.log('set value in checkbox', val);
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
      this.elementRef.nativeElement.checked = val;
    }
  }

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    console.log('in registerOnValidatorChange', fn);
    this.validatorOnChange = fn;
  }

  #validation = new ValidationController(this.elementRef.nativeElement, {
    validators: [requiredValidator]
  });

  /** Implemented as part of Validator. */
  // validate(c: AbstractControl): ValidationErrors | null {
  //   console.log('c in validate', c);
  //   return this.validator ? this.validator(c) : null;
  // }

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

    console.log('in checkbox control status', control, control.status, control.invalid, this.value);

    this.#validation.validate(control.value ? this.value : undefined);

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

    if (nativeElement.checkValidity() /*&& control.errors*/) {
      console.log('in input validate if');
      //this.elementRef.nativeElement.validation.render();
      //  return {invalid: true}
      //return control.errors;
      return null;
    } else {
      console.log('in input validate else');
      // return null;
      return control.errors;
    }

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

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('sl-change', ['$event.target.checked'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    console.log('value in checkbox listenforvaluechange', value);
    this.value = value;
   // this.validatorOnChange();
  }
} // TODO: on reset mark as pristine?
