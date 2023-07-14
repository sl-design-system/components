import {
  AfterViewChecked, ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  HostListener, Injectable, Injector,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, NgControl, NgForm,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {EventEmitter, ValidationController} from "@sl-design-system/shared";

// @Injectable({
//   // eslint-disable-next-line @angular-eslint/directive-selector
//   // selector: 'sl-text-input2',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => FormControlElementDirective),
//       multi: true
//     },
//     {
//       provide: NG_VALIDATORS,
//       useExisting: forwardRef(() => FormControlElementDirective),
//       multi: true
//     }
//   ]//,
//   // host: {'(submit)': 'onSubmit($event)'}, // host: {'(submit)': 'onSubmit($event)', '(reset)': 'onReset()'},
// })
@Injectable()
export abstract class FormControlElementDirective implements Omit<ControlValueAccessor, 'writeValue'>, Validator /*AfterViewInit,*/ { // TODO as abstract class?
  //protected control: NgControl | null = null;

  // /** View -> model callback called when value changes */
  // protected onChange: (value: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void = () => {};

  // /** View -> model callback called when control has been touched */
  // protected onTouched: () => void;
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validatorOnChange = () => {};

  protected constructor(protected elementRef: ElementRef, protected injector: Injector) {}

  // ngOnInit(): void {
  //   this.control = this.injector.get(NgControl, null);
  // }

  // registerOnChange(fn: (value: any) => void): void {
  //   this.onChange = (value: any) => {
  //     fn(value);
  //   };
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // registerOnTouched(fn: () => {}): void {
  //   this.onTouched = () => {
  //     fn();
  //   };
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  // ngAfterViewChecked(): void {
  //   console.log('afterviev...');
  // }

  // registerOnValidatorChange(fn: () => void): void {
  // }

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    this.validatorOnChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // return undefined;
    if (/*nativeElement.checkValidity() ||*/ control.untouched /*|| control.valid*/) {
      console.log('in checkbox validate if  formcontrollll', control);
      return control.errors;
      // return null;
    } else {
      console.log('in checkbox validate else formcontrollll', control);
      return null;
      // return control.errors;
    }
  }

  // writeValue(value: any): void {
  //   if (value) {
  //     this.value = value;
  //   }
  // }


  // // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  // onChange: (value: any) => void = () => {};
  // // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  // onTouched: () => any = () => {};
  //
  // // private validationStatusSubscription: Subscription | undefined;
  //
  // // private validationStatus$: Subject<boolean> = new Subject<boolean>();
  //
  //
  // // validationStatusChanges(): Observable<boolean> {
  // //   return this.validationStatus$.asObservable();
  // // }
  //
  // /** Part of Validator. */
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  // private validatorOnChange = () => {};
  //
  // /** The combined form control validator for this input. */
  //   // private validator: ValidatorFn | null;
  //
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // private _value: any;
  //
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // get value(): any {
  //   return this._value;
  // }
  //
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // set value(val: any) {
  //   console.log('val in set value', val, this.value, this.elementRef.nativeElement.input.value, this._value);
  //   if (val !== this._value) {
  //     this._value = val;
  //     this.onChange(this._value);
  //     //this.onTouched(); // TODO: onTouched is necessary?
  //     this.elementRef.nativeElement.input.value = val;
  //     this.validatorOnChange();
  //   }
  //   // this.validatorOnChange(); // TODO: necessary?
  //   console.log('val in set value after if', val, this.value, this.elementRef.nativeElement.input.value, this._value);
  // }
  //
  // #validation = new ValidationController(this.elementRef.nativeElement, {
  //   target: () => this.elementRef.nativeElement.querySelector('input') as HTMLInputElement
  // });
  //
  // //control: AbstractControl;
  //
  // /** Implemented as part of Validator. */
  // registerOnValidatorChange(fn: () => void): void {
  //   console.log('in registerOnValidatorChange', fn);
  //   this.validatorOnChange = fn;
  //
  //   // if (fn) {
  //   //   this.control = this.formControlDirective.control;
  //   //   if (this.control) {
  //   //     this.control.statusChanges.subscribe(() => {
  //   //       this.validate();
  //   //       fn();
  //   //     });
  //   //   }
  //   // }
  //
  //   // if (fn) {
  //   //   const ngControl = this.injector.get(NgControl);
  //   //   this.control = ngControl.control as AbstractControl;
  //   //   if (this.control) {
  //   //     this.control.statusChanges.subscribe(() => {
  //   //       this.validate(this.control);
  //   //       fn();
  //   //     });
  //   //   }
  //   // }
  // }
  //
  // // @HostListener('invalid', ['$event.detail.invalid'])
  // // onCustomValidationEvent(isValid: boolean) {
  // //   const element = this.elementRef.nativeElement;
  // //   console.log('oncustomvalidation event', element, isValid);
  // //   if (isValid) {
  // //     this.renderer.removeAttribute(element, 'invalid');
  // //   } else {
  // //     this.renderer.setAttribute(element, 'invalid', '');
  // //   }
  // // }
  //
  // /** Implemented as part of Validator. */
  // // validate(c: AbstractControl): ValidationErrors | null {
  // //   console.log('c in validate', c);
  // //   return this.validator ? this.validator(c) : null;
  // // }
  //
  // // TODO: use setValidation from validation.ts?
  //
  // // ngOnChanges(changes: SimpleChanges) {
  // //   console.log('changes in ngOnchanges', changes);
  // // }
  //
  // /*  ngAfterViewInit() {
  //     const inputElement = this.elementRef.nativeElement.querySelector('input');
  //
  //     console.log('input in ngafterviewinit', inputElement);
  //
  //     // if (inputElement) {
  //     //   const onInvalidListener = () => {
  //     //     this.validate(inputElement);
  //     //   };
  //     //
  //     //   console.log('ngafterviewinit', inputElement);
  //     //
  //     //   inputElement.addEventListener('invalid', onInvalidListener);
  //     //
  //     //   // Clean up the listener when the directive is destroyed
  //     //   // this.validationStatusSubscription = this.validationStatusChanges().subscribe(isValid => {
  //     //   //   if (isValid) {
  //     //   //     inputElement.removeEventListener('invalid', onInvalidListener);
  //     //   //     this.validationStatusSubscription?.unsubscribe();
  //     //   //   }
  //     //   // });
  //     // }
  //
  //     // const ngControl = this.ngControl.control;
  //
  //     // this.applyCustomValidationState();
  //
  //     this.elementRef.nativeElement.addEventListener('invalid', () => {
  //       this.#validation.validate(this.value);
  //     });
  //
  //     // this.validatorOnChange();
  //
  //   }*/
  //
  // ngAfterViewChecked() {
  //   const inputElement = this.elementRef.nativeElement.querySelector('input');
  //
  //   console.log('input in ngAfterViewChecked', inputElement, this._value);
  //
  //   // this.onChange(this._value);
  //   //  this.onTouched();
  //
  //   this.validatorOnChange(); // TODO: helps with delay, but not working yet on submitting
  //
  //   this.#validation.validate(this.value);
  //
  //   // inputElement.reportValidity();
  //   //this.#validation.setCustomValidity('bleh');
  //   // inputElement.reportValidity();
  //
  //   // this.elementRef.nativeElement.addEventListener('invalid', () => {
  //   //   this.#validation.validate(this.value);
  //   // });
  // }
  //
  // // applyCustomValidationState(): void {
  // //   console.log('applyCustomValidationState', this.elementRef.nativeElement.invalid, this.elementRef.nativeElement.touched, this.control);
  // //   const nativeElement = this.elementRef.nativeElement;
  // //   if (this.elementRef.nativeElement.invalid && this.elementRef.nativeElement.touched) {
  // //     // this.elementRef.nativeElement.validation.setCustomValidity('Invalid'); // Set the custom validation message
  // //     this.#validation.setCustomValidity('Invalid');
  // //   } else {
  // //     // this.elementRef.nativeElement.setCustomValidity(''); // Clear the custom validation message
  // //     this.#validation.setCustomValidity('');
  // //   }
  // // }
  //
  // // private _getControl(): AbstractControl | null {
  // //   const ngControl = this.elementRef.nativeElement.ngControl;
  // //   return ngControl ? ngControl.control : null;
  // // }
  //
  // validate(control: AbstractControl): ValidationErrors | null {
  //   const nativeElement: HTMLInputElement = this.elementRef.nativeElement;
  //   const input: HTMLInputElement = nativeElement.querySelector('input') as HTMLInputElement;
  //   console.log('nativeElement in validate',control, control.status, nativeElement, nativeElement.validity?.valid, input, control.errors, this.elementRef.nativeElement.validity); // reportValidity
  //   //console.log('nativeElement in validate',this.value, control,  nativeElement, nativeElement.validity?.valid, input, control.errors, this.elementRef.nativeElement.internals); // reportValidity
  //
  //
  //   // debugger;
  //
  //   /*    if (/!*nativeElement.checkValidity()*!/ input.checkValidity()) {
  //         return null;
  //       } else {
  //         // return {
  //         //   //invalid: true
  //         //   invalid: control.errors
  //         // };
  //         return control.errors;
  //       }*/
  //   // return control.errors;
  //
  //   // this.elementRef.nativeElement.setValidity(control);
  //
  //   // for (const validatorName in control?.errors) {
  //   //   console.log('validatorName in input', validatorName, control.errors, control.value);
  //   //   if(control.touched)
  //   //     // return getValidatorErrorMessage(validatorName, this.control.errors[validatorName]);
  //   //     // this.elementRef.nativeElement.setValidity(control.errors, validatorName);
  //   //   this.elementRef.nativeElement.validate(control.value);
  //   // }
  //
  //   // control.setErrors()
  //
  //   // TODO: if when updateon change / submit/ blur?
  //
  //   // if (control.invalid) {
  //   //   this.renderer.setAttribute(this.elementRef.nativeElement, 'invalid', '');
  //   // } else {
  //   //   this.renderer.removeAttribute(this.elementRef.nativeElement, 'invalid');
  //   // }
  //
  //   // this.#validation.validate(control.value); // TODO: necessary?
  //
  //   // this.#validation.render();
  //   //this.onChange('invalid');
  //
  //   // TODO: on touched and on submitted
  //
  //   // new EventEmitter(this.elementRef.nativeElement, 'invalid');
  //
  //   console.log('control touched -------->>>>>>>', control, control.touched, control.valid, input.validationMessage/*, (control.parent as NgForm).submitted*/ /*, input.reportValidity()*/);
  //
  //   // if (!control.errors)  {
  //   //   return null;
  //   // }
  //
  //
  //   // if (Validators.required(control)) {
  //   //   return { required: true }; // Map to the 'required' validation error
  //   // }
  //
  //   // const isValid = /* Perform your custom validation logic */;
  //   // const event = new CustomEvent('customValidationEvent', {
  //   //   detail: { isValid }
  //   // });
  //   // this.dispatchEvent(event);
  //
  //   // if (Validators.minLength(5)(control)) {
  //   //   return { minlength: true }; // Map to the 'minlength' validation error
  //   // }
  //
  //   // if (control.invalid && control.touched && this.#validation.target) {
  //   //   // this.elementRef.nativeElement.validation.setCustomValidity('Invalid'); // Set the custom validation message
  //   //   this.#validation.setCustomValidity('Invalid');
  //   // } else {
  //   //   // this.elementRef.nativeElement.setCustomValidity(''); // Clear the custom validation message
  //   //   this.#validation.setCustomValidity('');
  //   // }
  //
  //   console.log('in input validate control controlll', control, control.untouched);
  //   // input.reportValidity();
  //
  //   // control.updateValueAndValidity();
  //
  //   if (control.untouched /*&& control.pristine*/) {
  //     console.log('in input validate control untouched', control);
  //     // return control.errors; // TODO: return null or not causing invalid?
  //     return null;
  //   } else {
  //     console.log('in input validate control  else', control);
  //     // this.validatorOnChange();
  //     return control.errors;
  //   }
  //
  //   // input.reportValidity();
  //
  //   // control.updateValueAndValidity();
  //
  //   // if (control.touched) {
  //   //   control.updateValueAndValidity();
  //   //   console.log('is controlTouched', control, control.touched);
  //   // }
  //
  //   console.log('input in validate', input);
  //
  //
  //   /*    if (input.checkValidity()  || this.elementRef.nativeElement.checkValidity() || control.touched /!*control.invalid && control.touched*!/ /!*input.reportValidity()*!/ /!*&& control.errors*!/) { // TODO: working only on required, not minlength etc.
  //         console.log('in input validate if', control);
  //          // return {invalid: true}
  //         // return null;
  //        // this.onTouched();
  //        //  control.updateValueAndValidity();
  //         return null; //control.errors;
  //       } else {
  //         console.log('in input validate else', control);
  //         // this.elementRef.nativeElement.emit('invalid');
  //         // new EventEmitter(this.elementRef.nativeElement, 'invalid');
  //         // this.elementRef.nativeElement.invalid = true;
  //         return control.errors; //null;
  //         // return {invalid: true}
  //         // return control.errors;
  //        }*/
  //   // TODO: emit invalid event?
  //   //this.onChange(emit(event));
  //   // return control.errors;
  //
  //   // if (input) {
  //   //   const isValid = this.elementRef.nativeElement.checkValidity();
  //   //
  //   //   if (!isValid) {
  //   //     return { customValidation: true };
  //   //   }
  //   // }
  //   //
  //   // return null;
  //   // return null;
  //
  // }
  //
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // writeValue(value: any): void {
  //   if (value) {
  //     this.value = value;
  //   }
  // }
  //
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // registerOnChange(fn: any): void {
  //   console.log('register on change input', fn);
  //   this.onChange = fn;
  //   // this.validationStatusSubscription = this.elementRef.nativeElement.control?.statusChanges.subscribe(() => {
  //   //   // Emit the 'invalid' event from the web component if the control is invalid
  //   //   if (this.elementRef.nativeElement.invalid) {
  //   //     const event = new Event('invalid', { bubbles: true });
  //   //     this.elementRef.nativeElement.dispatchEvent(event);
  //   //   }
  //   //   // Call the provided callback function
  //   //   if (fn) {
  //   //     fn();
  //   //   }
  //   // });
  // }
  //
  // // TODO: set disabled
  //
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // registerOnTouched(fn: any): void {
  //   console.log('registerontouched in inpur directive');
  //   // this.validatorOnChange();
  //   this.onTouched = fn;
  //   // this.validatorOnChange();
  // }
  //
  // // private control: AbstractControl;
  //
  // // setDisabledState(isDisabled: boolean): void {
  // //   this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  // // }
  //
  // constructor(private elementRef: ElementRef, private renderer: Renderer2/*, @Self() @Optional() public control: NgControl, private form: NgForm*/) {
  //   // this.validator = Validators.compose(null);
  //   // this.validator = Validators.compose([this.parseValidator/*, this.minValidator, this.maxValidator, this.filterValidator*/]);
  // }
  //
  // // TODO: register icon separately? necessary to add import
  //
  // // @HostListener('input', ['$event.target.value'])
  // //   @HostListener('touch', ['$event'])
  // @HostListener('input', ['$event'])
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // listenForValueChange($event: any): void {
  //   const value = $event.target.value;
  //   console.log('input event on input', $event, value);
  //   this.value = value;
  //   // this.onTouched();
  //   // this.validatorOnChange();
  //
  //   console.log('this.elementRef.nativeElement.validators', this.elementRef.nativeElement.validators, this.elementRef.nativeElement, this.elementRef.nativeElement.valid);
  // }
  //
  // @HostListener('invalid', ['$event'])
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // listenForValueChangeInvalid($event: any): void {
  //   const value = $event.target.value;
  //   console.log('invalid event on input-----', $event, value);
  //   this.value = value;
  //   // this.onTouched();
  //   this.validatorOnChange();
  //
  //   // console.log('this.elementRef.nativeElement.validators', this.elementRef.nativeElement.validators, this.elementRef.nativeElement, this.elementRef.nativeElement.valid);
  // }
  //
  // @HostListener('submit', ['$event'])
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // listenForValueChangeSubmit($event: any): void {
  //   const value = $event.target.value;
  //   console.log('submit event on input-----', $event, value);
  //   // this.value = value;
  //   // this.onTouched();
  //   // this.validatorOnChange();
  //
  //   // console.log('this.elementRef.nativeElement.validators', this.elementRef.nativeElement.validators, this.elementRef.nativeElement, this.elementRef.nativeElement.valid);
  // }
  //
  // /*  @HostListener('ngModelChange', ['$event'])
  //   doStuff($event: Event) {
  //     const value = $event.target;
  //     console.log('ngModelChange event on input-----', $event, value);
  //   }*/
  //
  // /*  @HostListener('submit', ['$event.target.value'])
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   listenForValueChange(value: any): void {
  //     console.log('submit event on input', value);
  //     this.value = value;
  //     // this.onTouched();
  //     // this.validatorOnChange();
  //
  //     console.log('this.elementRef.nativeElement.validators___submit', this.elementRef.nativeElement.validators, this.elementRef.nativeElement, this.elementRef.nativeElement.valid);
  //   }
  //
  //   @HostListener('submit')
  //   onSubmit() {
  //     console.log('Form has been submitted');
  //   }*/
  //
  // @HostListener('submit')
  // onSubmit2() {
  //   console.log('Form has been submitted');
  // }
  //
  // // onSubmit($event: Event): void {
  // //   console.log('$event onSubmit', $event);
  // //   // (this as{submitted: boolean}).submitted = true;
  // //   // syncPendingControls(this.form, this._directives);
  // //   // this.ngSubmit.emit($event);
  // //   // return false;
  // // }
  //
  // // @HostListener('invalid', ['$event.target.value'])
  //
  // // parseValidator: ValidatorFn = (): ValidationErrors | null => {
  // //   return this.value ? null : { inputParse: { text: this.elementRef.nativeElement.value } };
  // // }
  //
  // // ValidateUrl(control: AbstractControl): ValidationErrors | null {
  // //   if (!control.value.startsWith('https') || !control.value.includes('.io')) {
  // //     return { invalidUrl: true };
  // //   }
  // //   return null;
  // // }
}

// export function ValidateUrl(control: AbstractControl) {
//   if (!control.value.startsWith('https') || !control.value.includes('.io')) {
//     return { invalidUrl: true };
//   }
//   return null;
// }


// TODO: create directive for form control
