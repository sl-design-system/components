import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, type ValidationErrors } from '@angular/forms';
import { type CheckboxGroup } from '@sl-design-system/checkbox';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-checkbox-group',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxGroupDirective),
      multi: true
    }
  ]
})
export class CheckboxGroupDirective extends FormControlElementDirective<CheckboxGroup> {
  constructor(@Inject(ElementRef) elementRef: ElementRef<CheckboxGroup>) {
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
