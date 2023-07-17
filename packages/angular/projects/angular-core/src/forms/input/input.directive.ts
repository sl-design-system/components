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
  selector: 'sl-text-input',
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

  private _value: string | undefined;

  get value(): string | undefined {
    return this._value;
  }

  set value(val: string | undefined) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.validatorOnChange();
    }
  }

  writeValue(value: string | undefined): void {
    if (value) {
      this.value = value;
      this.elementRef.nativeElement.input.value = value;
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
