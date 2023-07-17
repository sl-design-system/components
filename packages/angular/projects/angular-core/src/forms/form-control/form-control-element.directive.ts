import {
  ElementRef,
  Injectable,
  Injector
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Injectable()
export abstract class FormControlElementDirective implements Omit<ControlValueAccessor, 'writeValue'>, Validator {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onChange: (value: any) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onTouched: () => any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validatorOnChange = () => {};

  protected constructor(protected elementRef: ElementRef, protected injector: Injector) {}

  /** Implemented as part of ControlValueAccessor. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    this.validatorOnChange = fn;
  }

  /** Implemented as part of Validator. */
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.untouched) {
      return control.errors;
    } else {
      return null;
    }
  }
}
