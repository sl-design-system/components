import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener, Inject, Injector,
  Renderer2
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {FormControlElementDirective} from "../form-control/form-control-element.directive";

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
export class CheckboxDirective extends FormControlElementDirective /*ControlValueAccessor, Validator*/ {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  // onChange: (value: any) => void = () => {};
  // // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  // onTouched: () => any = () => {};
  //
  // /** Part of Validator. */
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  // private validatorOnChange = () => {};

  private _initialValue: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _value: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set value(val: any) {
    this._value = val;
    this.onChange(this._value);
    this.elementRef.nativeElement.internals.value = this._value;
  }

  /** Implemented as part of Validator. */
  // override registerOnValidatorChange(fn: () => void): void {
  //   this.validatorOnChange = fn;
  // }

  // validate(control: AbstractControl): ValidationErrors | null {
  //   // super.validate(control);
  //   // console.log('in checkbox control status', control.valid, control, control.status, control.invalid, this.value);
  //   //
  //   if (/*nativeElement.checkValidity() ||*/ control.untouched /*|| control.valid*/) {
  //     console.log('in checkbox validate if');
  //     return control.errors;
  //     // return null;
  //   } else {
  //     console.log('in checkbox validate else');
  //     return null;
  //     // return control.errors;
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any): void {
    this._initialValue = value;
    if (value) {
      this.elementRef.nativeElement.value = this._initialValue;
      this.elementRef.nativeElement.setFormValue(value);
      this.value = value;
    }
  }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }
  //
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }

  // setDisabledState(disabled: boolean): void {
  //   this.elementRef.nativeElement.disabled = disabled;
  // }

  constructor(public override elementRef: ElementRef, private renderer: Renderer2, @Inject(Injector) injector: Injector) {
    super(elementRef, injector); // TODO: not working
  }

  @HostListener('sl-change', ['$event.target.checked'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(checked: any): void {
    checked = this.elementRef.nativeElement.checked ? this._initialValue : undefined;
    this.value = checked;
  }
}
