import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, type ValidationErrors } from '@angular/forms';
import { type Checkbox } from '@sl-design-system/checkbox';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-checkbox',
  standalone: true,
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
  constructor(@Inject(ElementRef) elementRef: ElementRef<Checkbox>) {
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
