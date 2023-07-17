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
import {FormControlElementDirective} from '../form-control/form-control-element.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-checkbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxDirective),
      multi: true
    }
  ]
})
export class CheckboxDirective extends FormControlElementDirective {

  private _initialValue: string | undefined;

  private _value: string | undefined;

  get value(): string | undefined {
    return this._value;
  }

  set value(val: string | undefined) {
    this._value = val;
    this.onChange(this._value);
    this.elementRef.nativeElement.internals.value = this._value;
    this.validatorOnChange();
  }

  writeValue(value: string | undefined): void {
    this._initialValue = value;
    if (value) {
      this.elementRef.nativeElement.value = this._initialValue;
      this.elementRef.nativeElement.setFormValue(value);
      this.value = value;
    }
  }

  constructor(public override elementRef: ElementRef, private renderer: Renderer2, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  @HostListener('sl-change', ['$event.target.checked'])
  listenForValueChange(checked: string | undefined): void {
    checked = this.elementRef.nativeElement.checked ? this._initialValue : undefined;
    this.value = checked;
  }
}
