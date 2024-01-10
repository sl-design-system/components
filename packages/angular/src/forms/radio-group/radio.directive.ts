import { Directive, ElementRef, HostListener, Inject, Injector, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { Radio } from '@sl-design-system/radio-group';
import { FormControlElementDirective } from '../form-control/form-control-element.directive';

@Directive({
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
export class RadioDirective extends FormControlElementDirective<Radio> {
  #initialValue: string | null = null;
  #value?: unknown;

  get value(): unknown {
    return this.#value;
  }

  set value(val: unknown) {
    this.#value = val;
    this.onChange(this.#value);
    // this.elementRef.nativeElement.internals.value = this.#value;
    this.onValidatorChange();
  }

  writeValue(value: string): void {
    this.#initialValue = value;
    if (value) {
      this.elementRef.nativeElement.value = this.#initialValue;
      // this.elementRef.nativeElement.setFormValue(value);
      this.value = value;
    }
  }

  constructor(@Inject(ElementRef) elementRef: ElementRef<Radio>, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown', ['$event'])
  listenForValueChange(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.value = (event.target as Radio).value;
    this.elementRef.nativeElement.checked = (event.target as Radio).checked;
  }
}
