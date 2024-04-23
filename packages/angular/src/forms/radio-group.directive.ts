import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, type ValidationErrors } from '@angular/forms';
import { type RadioGroup } from '@sl-design-system/radio-group';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-radio-group',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioGroupDirective),
      multi: true
    }
  ]
})
export class RadioGroupDirective extends FormControlElementDirective<RadioGroup> {
  constructor(@Inject(ElementRef) elementRef: ElementRef<RadioGroup>) {
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
