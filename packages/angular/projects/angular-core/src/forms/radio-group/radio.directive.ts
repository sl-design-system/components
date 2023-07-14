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
export class RadioDirective extends FormControlElementDirective/*implements ControlValueAccessor, Validator*/ {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  // onChange: (value: any) => void = () => {};
  // // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  // onTouched: () => any = () => {};

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
  //
  // /** Implemented as part of Validator. */
  // registerOnValidatorChange(fn: () => void): void {
  //   this.validatorOnChange = fn;
  // }

  // validate(control: AbstractControl): ValidationErrors | null {
  //   if (/*nativeElement.checkValidity() &&*/ control.untouched /*|| control.valid*/ /*&& control.errors*/) {
  //     console.log('in radio validate if');
  //     //this.elementRef.nativeElement.validation.render();
  //     //  return {invalid: true}
  //     //return control.errors;
  //     return null;
  //   } else {
  //     console.log('in radio validate else');
  //     // return null;
  //     return control.errors;
  //   }
  // }

  constructor(public override elementRef: ElementRef, private renderer: Renderer2, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  @HostListener('click', ['$event.target'])
  @HostListener('keydown', ['$event.target'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    this.value = value.value;
    this.elementRef.nativeElement.checked = value.checked;
  }

  // setDisabledState(isDisabled: boolean): void {
  //   this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  // }
}
