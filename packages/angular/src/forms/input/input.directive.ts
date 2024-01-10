import { Directive, ElementRef, HostListener, Inject, Injector, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { TextField } from '@sl-design-system/text-field';
import { FormControlElementDirective } from '../form-control/form-control-element.directive';

@Directive({
  selector: 'sl-text-field',
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
export class InputDirective extends FormControlElementDirective<TextField> {
  #value?: string;

  get value(): string {
    return this.#value ?? '';
  }

  set value(val: string) {
    if (val !== this.#value) {
      this.#value = val;
      this.onChange(this.#value);
      this.onValidatorChange();
    }
  }

  writeValue(value: string): void {
    if (value) {
      this.value = value;
      this.elementRef.nativeElement.value = value;
    }
  }

  constructor(@Inject(ElementRef) elementRef: ElementRef<TextField>, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  @HostListener('input', ['$event.target.value'])
  listenForValueChange(value: string): void {
    this.value = value;
  }
}
