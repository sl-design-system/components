import { ChangeDetectorRef, Directive, ElementRef, Inject, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, type ValidationErrors } from '@angular/forms';
import { type Combobox } from '@sl-design-system/combobox';
import { FormControlElementDirective } from './form-control-element.directive';

@Directive({
  selector: 'sl-combobox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ComboboxDirective),
      multi: true
    }
  ]
})
export class ComboboxDirective extends FormControlElementDirective<Combobox> {
  constructor(
    @Inject(ElementRef) elementRef: ElementRef<Combobox>,
    @Inject(ChangeDetectorRef) changeDetection: ChangeDetectorRef
  ) {
    super(elementRef, changeDetection);
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
