import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type Switch } from '@sl-design-system/switch';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-switch',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SwitchDirective),
      multi: true
    }
  ]
})
export class SwitchDirective extends FormControlElementDirective<Switch> {
  constructor(@Inject(ElementRef) elementRef: ElementRef<Switch>) {
    super(elementRef);
  }
}
