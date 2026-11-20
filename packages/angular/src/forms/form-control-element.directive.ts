import {
  type ChangeDetectorRef,
  type ElementRef,
  Injectable,
  type OnDestroy,
  type OnInit
} from '@angular/core';
import {
  type AbstractControl,
  type ControlValueAccessor,
  type ValidationErrors,
  type Validator
} from '@angular/forms';
import { type FormControl } from '@sl-design-system/form';

@Injectable()
export abstract class FormControlElementDirective<T extends HTMLElement & FormControl>
  implements ControlValueAccessor, OnDestroy, OnInit, Validator
{
  #lastValidation?: {
    control?: AbstractControl;
    errors: string;
    touched?: boolean;
  };

  #onBlur = (): void => {
    this.onTouched();

    const lastValidation = this.#lastValidation;
    if (lastValidation?.control && lastValidation.touched !== lastValidation.control.touched) {
      this.#onValidate();
    }
  };

  #onChange = (event: Event): void => {
    const updateOn = this.#lastValidation?.control?.updateOn;

    // Touch change-driven controls first so their validators see it in the same pass.
    if (updateOn === 'change') {
      this.onTouched();
    }

    this.onChange((event as CustomEvent<T['formValue']>).detail);

    // Angular commits blur-driven controls when the component actually loses focus.
    if (updateOn === 'submit' || updateOn === undefined) {
      this.onTouched();
    }

    this.changeDetection.markForCheck();
  };

  #onValidate = (): void => {
    const lastValidation = this.#lastValidation;
    if (
      !lastValidation ||
      lastValidation.touched !== lastValidation.control?.touched ||
      lastValidation.errors !== JSON.stringify(this.getValidationErrors())
    ) {
      this.onValidatorChange();
      this.changeDetection.markForCheck();
    }
  };

  protected onChange: (value: T['formValue']) => void = () => {};
  protected onTouched: () => void = () => {};
  protected onValidatorChange = (): void => {};

  get element(): T {
    return this.elementRef.nativeElement;
  }

  constructor(
    protected elementRef: ElementRef<T>,
    protected changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.element.addEventListener('sl-blur', this.#onBlur);
    this.element.addEventListener('sl-change', this.#onChange);
    this.element.addEventListener('sl-validate', this.#onValidate);
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('sl-blur', this.#onBlur);
    this.element.removeEventListener('sl-change', this.#onChange);
    this.element.removeEventListener('sl-validate', this.#onValidate);
  }

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

  /** Implemented as part of ControlValueAccessor. */
  setDisabledState(disabled: boolean): void {
    this.element.disabled = disabled;
  }

  /** Implemented as part of Validator. */
  validate(control?: AbstractControl): ValidationErrors | null {
    const errors = this.getValidationErrors();
    this.#lastValidation = { control, errors: JSON.stringify(errors), touched: control?.touched };

    return errors;
  }

  protected getValidationErrors(): ValidationErrors | null {
    return null;
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: T['formValue']): void {
    this.element.formValue = value;
  }
}
