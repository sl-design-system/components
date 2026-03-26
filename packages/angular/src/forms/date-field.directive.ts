import { ChangeDetectorRef, Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type DateField } from '@sl-design-system/date-field';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-date-field',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateFieldDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateFieldDirective),
      multi: true
    }
  ]
})
export class DateFieldDirective extends FormControlElementDirective<DateField> {
  constructor(
    @Inject(ElementRef) elementRef: ElementRef<DateField>,
    @Inject(ChangeDetectorRef) changeDetection: ChangeDetectorRef
  ) {
    super(elementRef, changeDetection);
  }
}
