import { Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, type ValidationErrors } from '@angular/forms';
import { type TextArea } from '@sl-design-system/text-area';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-text-area',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextAreaDirective),
      multi: true
    }
  ]
})
export class TextAreaDirective extends FormControlElementDirective<TextArea> {
  constructor(@Inject(ElementRef) elementRef: ElementRef<TextArea>) {
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
