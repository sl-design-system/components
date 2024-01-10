/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ElementRef, Injector } from '@angular/core';
import { Injectable } from '@angular/core';
import type { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';

@Injectable()
export abstract class FormControlElementDirective<T = HTMLElement>
  implements Omit<ControlValueAccessor, 'writeValue'>, Validator
{
  onChange: (value: any) => void = () => {};
  onTouched: () => any = () => {};
  onValidatorChange = (): void => {};

  constructor(protected elementRef: ElementRef<T>, protected injector: Injector) {}

  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** Implemented as part of Validator. */
  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  /** Implemented as part of Validator. */
  validate(control: AbstractControl): ValidationErrors | null {
    return control.untouched ? control.errors : null;
  }
}
