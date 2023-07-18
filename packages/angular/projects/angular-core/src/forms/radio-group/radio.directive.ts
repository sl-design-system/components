import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  Injector,
  Renderer2
} from '@angular/core';
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { FormControlElementDirective } from '../form-control/form-control-element.directive';
import type { Radio } from '@sl-design-system/radio-group';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-radio',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioDirective),
      multi: true
    }
  ]
})
export class RadioDirective extends FormControlElementDirective {

  #initialValue: string | undefined;

  #value = '';

  get value(): string {
    return this.#value;
  }

  set value(val: string) {
    this.#value = val;
    this.onChange(this.#value);
    this.elementRef.nativeElement.internals.value = this.#value;
    this.validatorOnChange();
  }

  writeValue(value: string): void {
    this.#initialValue = value;
    if (value) {
      this.elementRef.nativeElement.value = this.#initialValue;
      this.elementRef.nativeElement.setFormValue(value);
      this.value = value;
    }
  }

  constructor(public override elementRef: ElementRef, private renderer: Renderer2, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown', ['$event'])
  listenForValueChange(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.value = (event.target as Radio).value;
    this.elementRef.nativeElement.checked = (event.target as Radio).checked;
  }
}
