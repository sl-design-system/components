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

export class TextareaDirective extends FormControlElementDirective {

  #value: string | undefined;

  get value(): string | undefined {
    return this.#value;
  }

  set value(val: string | undefined) {
     if (val !== this.#value) {
      this.#value = val;
      this.onChange(this.#value);
      this.validatorOnChange();
     }
  }

  writeValue(value: string | undefined): void {
    if (value) {
      this.value = value;
      this.elementRef.nativeElement.textarea.value = value;
    }
  }

  constructor(public override elementRef: ElementRef, private renderer: Renderer2, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  @HostListener('input', ['$event.target.value'])
  listenForValueChange(value: string | undefined): void {
    this.value = value;
  }
}
