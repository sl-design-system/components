import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import type { ValidationErrors } from '@angular/forms';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type Select } from '@sl-design-system/select';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectDirective),
      multi: true
    }
  ]
})
export class SelectDirective extends FormControlElementDirective<Select> {
  constructor(@Inject(ElementRef) elementRef: ElementRef<Select>) {
    super(elementRef);
  }

  override validate(): ValidationErrors | null {
    if (this.element.valid) {
      return null;
    } else if (this.element.validity.valueMissing) {
      return { required: true };
    }

    return null;
  }
}
