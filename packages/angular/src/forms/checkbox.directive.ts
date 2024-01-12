import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type Checkbox } from '@sl-design-system/checkbox';
import { FormControlElementDirective } from './form-control-element.directive';

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
  constructor(@Inject(ElementRef) elementRef: ElementRef<Checkbox>) {
    super(elementRef);
  }
}
