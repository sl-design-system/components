import { Directive, ElementRef, HostListener, Inject, Injector, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type Checkbox } from '@sl-design-system/checkbox';
import { FormControlElementDirective } from '../form-control/form-control-element.directive';

@Directive({
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
export class CheckboxDirective extends FormControlElementDirective<Checkbox> {
  #initialValue?: unknown;
  #value?: unknown;

  get value(): unknown {
    return this.#value;
  }

  set value(val: unknown) {
    this.#value = val;
    this.onChange(this.#value);
    this.elementRef.nativeElement.value = this.#value;
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

  constructor(@Inject(ElementRef) elementRef: ElementRef<Checkbox>, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  @HostListener('sl-change', ['$event.target.checked'])
  listenForValueChange(): void {
    this.value = this.elementRef.nativeElement.checked ? this.#initialValue : undefined;
  }
}
