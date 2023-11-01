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

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-text-field',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputDirective),
      multi: true
    }
  ]
})

export class InputDirective extends FormControlElementDirective {

  #value?: string;

  get value(): string {
    return this.#value ?? '';
  }

  set value(val: string) {
    if (val !== this.#value) {
      this.#value = val;
      this.onChange(this.#value);
      this.validatorOnChange();
    }
  }

  writeValue(value: string): void {
    if (value) {
      this.value = value;
      this.elementRef.nativeElement.input.value = value;
    }
  }

  constructor(public override elementRef: ElementRef, private renderer: Renderer2, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  @HostListener('input', ['$event.target.value'])
  listenForValueChange(value: string): void {
    this.value = value;
  }
}
