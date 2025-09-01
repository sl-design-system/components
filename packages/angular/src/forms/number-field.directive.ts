import { ChangeDetectorRef, Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, type ValidationErrors } from '@angular/forms';
import { type NumberField } from '@sl-design-system/number-field';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-number-field',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFieldDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberFieldDirective),
      multi: true
    }
  ]
})
export class NumberFieldDirective extends FormControlElementDirective<NumberField> {
  constructor(
    @Inject(ElementRef) elementRef: ElementRef<NumberField>,
    @Inject(ChangeDetectorRef) changeDetection: ChangeDetectorRef
  ) {
    super(elementRef, changeDetection);
  }

  override validate(): ValidationErrors | null {
    if (this.element.valid) {
      return null;
    } else if (
      !this.element.valid &&
      typeof this.element.min === 'number' &&
      typeof this.element.valueAsNumber === 'number' &&
      this.element.min > this.element.valueAsNumber
    ) {
      return {
        rangeUnderflow: { min: this.element.min, actual: this.element.valueAsNumber }
      };
    } else if (
      !this.element.valid &&
      typeof this.element.max === 'number' &&
      typeof this.element.valueAsNumber === 'number' &&
      this.element.max < this.element.valueAsNumber
    ) {
      return {
        rangeOverflow: { max: this.element.max, actual: this.element.valueAsNumber }
      };
    } else if (this.element.validity.valueMissing) {
      return { required: true };
    }

    return null;
  }
}
