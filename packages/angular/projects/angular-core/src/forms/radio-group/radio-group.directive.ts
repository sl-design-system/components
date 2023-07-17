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
import { Radio } from '@sl-design-system/radio-group';
import { FormControlElementDirective } from '../form-control/form-control-element.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-radio-group',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioGroupDirective),
      multi: true
    }
  ]
})
export class RadioGroupDirective extends FormControlElementDirective {

  private _initialValue: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _value: string | undefined;

  get value() {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set value(val: string | undefined) {
    this._value = val;
    this.onChange(this._value);
    this.elementRef.nativeElement.buttons?.forEach((radio: Radio) => (radio.checked = radio.value === this.value));
    this.elementRef.nativeElement.internals.value = this._value;
    this.validatorOnChange();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any): void {
    value = value ? value : undefined;
    this._initialValue = value;
    //if (value) {
      this.elementRef.nativeElement.buttons?.forEach((radio: Radio) => (radio.checked = radio.value === this.value));
      this.elementRef.nativeElement.value = this._initialValue;
      this.elementRef.nativeElement.setFormValue(value);
      this.value = value;
      this.validatorOnChange();
    //}
  }

  constructor(public override elementRef: ElementRef, private renderer: Renderer2, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  @HostListener('click', ['$event.target'])
  @HostListener('keydown', ['$event.target'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    this.value = value;
    this.elementRef.nativeElement.checked = value.checked;
  }
}
