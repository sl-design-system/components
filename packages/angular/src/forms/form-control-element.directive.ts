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
  #onBlur = (): void => this.onTouched();

  #onChange = (event: Event): void => {
    this.onChange((event as CustomEvent<T['formValue']>).detail);
    this.onTouched();
    this.changeDetection.markForCheck();
  };

  #onValidate = (): void => this.onValidatorChange();

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
  validate(_control: AbstractControl): ValidationErrors | null {
    return null;
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: T['formValue']): void {
    this.element.formValue = value;
  }
}
