import { Directive, ElementRef, HostListener, Inject, Injector, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type Textarea } from '@sl-design-system/textarea';
import { FormControlElementDirective } from '../form-control/form-control-element.directive';

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
  #value?: string;

  get value(): string {
    return this.#value ?? '';
  }

  set value(val: string) {
    if (val !== this.#value) {
      this.#value = val;
      this.onChange(this.#value);
      this.onValidatorChange();
    }
  }

  writeValue(value: string): void {
    if (value) {
      this.value = value;
      this.elementRef.nativeElement.value = value;
    }
  }

  constructor(@Inject(ElementRef) elementRef: ElementRef<Textarea>, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  @HostListener('input', ['$event.target.value'])
  listenForValueChange(value: string): void {
    this.value = value;
  }
}
