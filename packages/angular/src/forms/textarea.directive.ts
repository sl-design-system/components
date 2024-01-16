import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import type { ValidationErrors } from '@angular/forms';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type Textarea } from '@sl-design-system/textarea';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-textarea',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextareaDirective),
      multi: true
    }
  ]
})
export class TextareaDirective extends FormControlElementDirective<Textarea> {
  constructor(@Inject(ElementRef) elementRef: ElementRef<Textarea>) {
    super(elementRef);
  }

  override validate(): ValidationErrors | null {
    if (this.element.valid) {
      return null;
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
