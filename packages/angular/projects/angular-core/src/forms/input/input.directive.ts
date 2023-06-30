import {
  AfterContentChecked,
  AfterViewChecked,
  Directive,
  ElementRef,
  forwardRef,
  HostListener
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";
import { ValidationController} from "@sl-design-system/shared";

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

export class InputDirective implements ControlValueAccessor, Validator, /*AfterViewInit,*/ AfterViewChecked, AfterContentChecked {
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
      //this.onTouched(); // TODO: onTouched is necessary?
      this.validatorOnChange();
       // this.#validation.validate(this._value);
    }
    // this.onChange(this._value);
    this.validatorOnChange(); // TODO: necessary?
   // console.log('val in set value after if', val, this.value, this.elementRef.nativeElement.input.value, this._value);
  }

  #validation = new ValidationController(this.elementRef.nativeElement, {
    target: () => this.elementRef.nativeElement.querySelector('input') as HTMLInputElement
  });

  //control: AbstractControl;

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
   // console.log('in registerOnValidatorChange', fn);
    this.validatorOnChange = fn;
  }

  /** Implemented as part of Validator. */
  // validate(c: AbstractControl): ValidationErrors | null {
  //   console.log('c in validate', c);
  //   return this.validator ? this.validator(c) : null;
  // }

  ngAfterViewChecked() {
     const inputElement = this.elementRef.nativeElement.querySelector('input');
    //
    // console.log('input in ngAfterViewChecked', inputElement, this._value);
    //
    // this.validatorOnChange(); // TODO: helps with delay, but not working yet on submitting
    //
    // this.#validation.validate(this.value);
  }

  ngAfterContentChecked() {
     const inputElement = this.elementRef.nativeElement.querySelector('input');
    //
    // console.log('input in ngAfterContedChecked', inputElement, this._value, this);
    // this.#validation.validate(this.value);
    // this.validatorOnChange();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const nativeElement: HTMLInputElement = this.elementRef.nativeElement;
    const input: HTMLInputElement = nativeElement.querySelector('input') as HTMLInputElement;
    console.log('nativeElement in validate',control, control.status, nativeElement, nativeElement.validity?.valid, input, control.errors, this.elementRef.nativeElement.validity); // reportValidity


    // TODO: if when updateon change / submit/ blur?

    // TODO: on touched and on submitted

    // new EventEmitter(this.elementRef.nativeElement, 'invalid');

    console.log('control touched -------->>>>>>>', control, control.touched, control.valid, input.validationMessage/*, (control.parent as NgForm).submitted*/ /*, input.reportValidity()*/);


    // if (Validators.required(control)) {
    //   return { required: true }; // Map to the 'required' validation error
    // }

    // const isValid = /* Perform your custom validation logic */;
    // const event = new CustomEvent('customValidationEvent', {
    //   detail: { isValid }
    // });
    // this.dispatchEvent(event);

    // if (Validators.minLength(5)(control)) {
    //   return { minlength: true }; // Map to the 'minlength' validation error
    // }

    // if (control.invalid && control.touched && this.#validation.target) {
    //   // this.elementRef.nativeElement.validation.setCustomValidity('Invalid'); // Set the custom validation message
    //   this.#validation.setCustomValidity('Invalid');
    // } else {
    //   // this.elementRef.nativeElement.setCustomValidity(''); // Clear the custom validation message
    //   this.#validation.setCustomValidity('');
    // }

    console.log('in input validate control controlll', control, control.untouched);
    // input.reportValidity();

    // control.updateValueAndValidity();

    if (control.untouched /*&& control.pristine*/) {
      console.log('in input validate control untouched', control);
      // return control.errors; // TODO: return null or not causing invalid?
      return null;
    } else {
      console.log('in input validate control  else', control);
      // this.validatorOnChange();
      return control.errors;
    }

    // input.reportValidity();

    // control.updateValueAndValidity();

    // if (control.touched) {
    //   control.updateValueAndValidity();
    //   console.log('is controlTouched', control, control.touched);
    // }

    console.log('input in validate', input);


/*    if (input.checkValidity()  || this.elementRef.nativeElement.checkValidity() || control.touched /!*control.invalid && control.touched*!/ /!*input.reportValidity()*!/ /!*&& control.errors*!/) { // TODO: working only on required, not minlength etc.
      console.log('in input validate if', control);
       // return {invalid: true}
      // return null;
     // this.onTouched();
     //  control.updateValueAndValidity();
      return null; //control.errors;
    } else {
      console.log('in input validate else', control);
      // this.elementRef.nativeElement.emit('invalid');
      // new EventEmitter(this.elementRef.nativeElement, 'invalid');
      // this.elementRef.nativeElement.invalid = true;
      return control.errors; //null;
      // return {invalid: true}
      // return control.errors;
     }*/
    // TODO: emit invalid event?
    //this.onChange(emit(event));
    // return control.errors;
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

  // TODO: set disabled

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // setDisabledState(isDisabled: boolean): void {
  //   this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  // }

  constructor(private elementRef: ElementRef) {}

  // TODO: register icon separately? necessary to add import

  @HostListener('input', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange($event: any): void {
    const value = $event.target.value;
    // console.log('input event on input', $event, value);
    this.value = value;
    console.log('this.elementRef.nativeElement.validators', this.elementRef.nativeElement.validators, this.elementRef.nativeElement, this.elementRef.nativeElement.valid);
  }

/*  @HostListener('invalid', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChangeInvalid($event: any): void {
    const value = $event.target.value;
    console.log('invalid event on input-----', $event, value);
     this.value = value;
     this.validatorOnChange();
  }*/

/*  @HostListener('sl-submit', ['$event'])
  onSubmit2($event: Event) {
    this.onTouched();
    console.log('Form has been submitted', $event);
  }*/

}
