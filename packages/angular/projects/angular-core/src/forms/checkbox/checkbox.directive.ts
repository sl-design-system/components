import {
  Directive,
  forwardRef,
  ElementRef,
  HostListener, Renderer2, OnInit, AfterContentInit,
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
export class CheckboxDirective implements ControlValueAccessor, Validator, OnInit, AfterContentInit {
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
    console.log('set value in checkbox', val);
   // this._initialValue = val;
    // if (val !== this._value) {
        this._value = val;
      // this._value = val ? val : undefined;
      // this._value = this.elementRef.nativeElement.checked ? val : undefined;
     // this.#validation.validate(this.checked ? this.value : undefined);
      this.onChange(this._value/*this.elementRef.nativeElement.checked*/);
      // this.onTouched();
      //  this.elementRef.nativeElement.checked = this._value; //val;
     // this.elementRef.nativeElement.internals.checked = this._value;
     //   this.elementRef.nativeElement.setFormValue(this._value/*this.checked ? this.value : undefined*/);
    //  this.elementRef.nativeElement.setFormValue(val/*this._value*//*this.checked ? this.value : undefined*/);
    //   this.validatorOnChange();
    // }
    this.elementRef.nativeElement.internals.value = this._value;
    console.log('set value in checkbox this._value', this._value);
    console.log('writevalue2233', this.elementRef.nativeElement.internals.value);
  }

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    console.log('in registerOnValidatorChange', fn);
    this.validatorOnChange = fn;
  }

  // #validation = new ValidationController(this.elementRef.nativeElement, {
  //   validators: [requiredValidator]
  // });

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

    console.log('in checkbox control status', control.valid, control, control.status, control.invalid, this.value);

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

    if (/*nativeElement.checkValidity() ||*/ control.untouched /*|| control.valid*/ /*&& control.errors*/) {
      console.log('in checkbox validate if');
      //this.elementRef.nativeElement.validation.render();
      //  return {invalid: true}
      return control.errors;
      // return null;
    } else {
      console.log('in checkbox validate else');
      return null;
      // return control.errors;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any): void {
    console.log('writevalue', value);
   // this.elementRef.nativeElement.setFormValue(value);
    console.log('writevalue22', this.elementRef.nativeElement.internals.value, this._initialValue);
    this._initialValue = value;
    console.log('writevalue22_', this.elementRef.nativeElement.internals.value, this._initialValue);
    if (value) {
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

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    // this.elementRef.nativeElement.setFormControlElement(this);
    //this.value = newValue;
  }

  ngOnInit(): void {
    console.log('in ngoninit', this.elementRef.nativeElement, this.elementRef.nativeElement.value, this.elementRef.nativeElement.internals.value);
  }

  ngAfterContentInit(): void {
    console.log('in ngAfterContentInit', this.elementRef.nativeElement, this.elementRef.nativeElement.value, this.elementRef.nativeElement.internals.value);
  }

  @HostListener('sl-change', ['$event.target.checked']) // ['$event.target.checked']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void { // TODO: rename value to checked
    console.log('value in checkbox listenforvaluechange', value, this._value, value.checked, this.elementRef.nativeElement.internals.value);
    // value = this.elementRef.nativeElement.checked ? value : undefined
    // this.value = value;
    console.log('1value in checkbox listenforvaluechange', value, this.elementRef.nativeElement.value, value.checked, this._initialValue, this.elementRef.nativeElement.checked);

    // if (value || this._value) {
    //   const newValue = this.elementRef.nativeElement.checked ? this._value : undefined;
    //   this.elementRef.nativeElement.setFormValue(newValue);
    //   this.value = newValue;
    //   console.log('1value in checkbox listenforvaluechange newValue', newValue, this._value);
    // }
    value = this.elementRef.nativeElement.checked ? this._initialValue : undefined;

    console.log('1value in checkbox listenforvaluechange22', value, this._initialValue, this.elementRef.nativeElement.value, value, this._initialValue, this.elementRef.nativeElement.checked);


    this.value = value;
    // this.elementRef.nativeElement.setFormValue(value);

    // if (changes.has('checked') || changes.has('value')) {
    //   this.setFormValue(this.checked ? this.value : undefined);
    // }
    // this.elementRef.nativeElement.setFormValue(value/*this._value*//*this.checked ? this.value : undefined*/);
   // this.validatorOnChange();
  }
} // TODO: on reset mark as pristine?
