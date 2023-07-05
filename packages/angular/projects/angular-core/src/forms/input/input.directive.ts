import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  ElementRef,
  forwardRef,
  HostListener, OnChanges, SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";

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

export class InputDirective implements ControlValueAccessor, Validator/*,*/ , AfterViewInit, AfterContentInit, OnChanges /*AfterViewChecked,*/ /*AfterContentChecked */{
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
    // console.log('val in set value', val, this.value, this.elementRef.nativeElement.input.value, this._value);
    //  this.elementRef.nativeElement.input.value = val;
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      //this.onTouched(); // TODO: onTouched is necessary?
      //this.elementRef.nativeElement.input.value = val;
      this.validatorOnChange();
       // this.#validation.validate(this._value);
    }
    console.log('this.elementRef.nativeElement.input', this.elementRef.nativeElement.input);
    // this.elementRef.nativeElement.input.value = val;
    // this.onChange(this._value);
    // this.validatorOnChange(); // TODO: necessary?
   // console.log('val in set value after if', val, this.value, this.elementRef.nativeElement.input.value, this._value);
  }

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    this.validatorOnChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // const nativeElement: HTMLInputElement = this.elementRef.nativeElement;
    // const input: HTMLInputElement = nativeElement.querySelector('input') as HTMLInputElement;
    // console.log('nativeElement in validate',control, control.status, nativeElement, nativeElement.validity?.valid, input, control.errors, this.elementRef.nativeElement.validity); // reportValidity


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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any): void {
    if (value) {
      this.value = value;
       // this.elementRef.nativeElement.input.value = value;
      // this.validatorOnChange();
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
    //this.validatorOnChange();
  }

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes:SimpleChanges): void {
    // this.elementRef.nativeElement.input.value = val;
    console.log('this.elementRef.nativeElement.input.value22aa onchanges', this.elementRef.nativeElement.input.value, this._value, this.value, changes);
    // this.elementRef.nativeElement.input.value = this.value;
  }

  ngAfterViewInit(): void {
    // this.elementRef.nativeElement.input.value = val;
    console.log('this.elementRef.nativeElement.input.value', this.elementRef.nativeElement.input.value, this._value, this.value);
    // this.elementRef.nativeElement.input.value = this.value;
  }

  ngAfterContentInit(): void {
    // this.elementRef.nativeElement.input.value = val;
    console.log('this.elementRef.nativeElement.input.value22', this.elementRef.nativeElement.input.value, this._value, this.value);
    // this.elementRef.nativeElement.input.value = this.value;
  }

  @HostListener('input', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange($event: any): void {
    const value = $event.target.value;
    this.value = value;
    // this.elementRef.nativeElement.input.value = value;
    // console.log('this.elementRef.nativeElement.validators', this.elementRef.nativeElement.validators, this.elementRef.nativeElement, this.elementRef.nativeElement.valid);
  }

}
