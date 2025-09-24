import { ChangeDetectorRef, Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type TimeField } from '@sl-design-system/time-field';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-time-field',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeFieldDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeFieldDirective),
      multi: true
    }
  ]
})
export class TimeFieldDirective extends FormControlElementDirective<TimeField> {
  constructor(
    @Inject(ElementRef) elementRef: ElementRef<TimeField>,
    @Inject(ChangeDetectorRef) changeDetection: ChangeDetectorRef
  ) {
    super(elementRef, changeDetection);
  }
}
