import { Injectable } from '@angular/core';
import type { ElementRef, OnDestroy, OnInit } from '@angular/core';
import type { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';
import type { FormControl } from '@sl-design-system/form';

@Injectable()
export abstract class FormControlElementDirective<T extends HTMLElement & FormControl>
  implements ControlValueAccessor, OnDestroy, OnInit, Validator
{
  #onChange = (event: Event): void => {
    this.onChange((event as CustomEvent<T['formValue']>).detail);
    this.onTouched();
  };

  protected onChange: (value: T['formValue']) => void = () => {};
  protected onTouched: () => void = () => {};
  protected onValidatorChange = (): void => {};

  get element(): T {
    return this.elementRef.nativeElement;
  }

  constructor(protected elementRef: ElementRef<T>) {}

  ngOnInit(): void {
    this.element.addEventListener('sl-blur', this.onTouched);
    this.element.addEventListener('sl-change', this.#onChange);
    this.element.addEventListener('sl-validate', this.onValidatorChange);
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('sl-blur', this.onTouched);
    this.element.removeEventListener('sl-change', this.#onChange);
    this.element.removeEventListener('sl-validate', this.onValidatorChange);
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
