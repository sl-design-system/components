import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, type ValidationErrors } from '@angular/forms';
import { type TextField } from '@sl-design-system/text-field';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-text-field',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextFieldDirective),
      multi: true
    }
  ]
})
export class TextFieldDirective extends FormControlElementDirective<TextField> {
  constructor(@Inject(ElementRef) elementRef: ElementRef<TextField>) {
    super(elementRef);
  }

  override validate(): ValidationErrors | null {
    if (this.element.valid) {
      return null;
    } else if (this.element.validity.patternMismatch) {
      return { pattern: { requiredPattern: this.element.pattern, actualValue: this.element.value } };
    } else if (this.element.validity.tooLong) {
      return { maxlength: { requiredLength: this.element.maxLength, actualLength: this.element.value.length } };
    } else if (this.element.validity.tooShort) {
      return { minlength: { requiredLength: this.element.minLength, actualLength: this.element.value.length } };
    } else if (this.element.validity.valueMissing) {
      return { required: true };
    }

    return null;
  }
}
