import { Directive, ElementRef, HostListener, Inject, Injector, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { RadioGroup } from '@sl-design-system/radio-group';
import { FormControlElementDirective } from '../form-control/form-control-element.directive';

@Directive({
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
export class RadioGroupDirective extends FormControlElementDirective<RadioGroup> {
  #initialValue?: unknown;
  #value?: unknown;

  get value(): unknown {
    return this.#value;
  }

  set value(val: unknown) {
    this.#value = val;
    this.onChange(this.#value);
    // (this.elementRef.nativeElement.buttons as Radio[])?.forEach((radio: Radio) => (radio.checked = radio.value === this.value));
    // this.elementRef.nativeElement.internals.value = this.#value;
    this.onValidatorChange();
  }

  writeValue(value: string): void {
    const newValue = value ? value : null;
    this.#initialValue = newValue;
    if (newValue) {
      // (this.elementRef.nativeElement.buttons as Radio[])?.forEach((radio: Radio) => (radio.checked = radio.value === this.value));
      this.elementRef.nativeElement.value = this.#initialValue;
      // this.elementRef.nativeElement.setFormValue(newValue);
      this.value = newValue;
    }
  }

  constructor(@Inject(ElementRef) elementRef: ElementRef<RadioGroup>, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  setDisabledState(disabled: boolean): void {
    this.elementRef.nativeElement.disabled = disabled;
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown', ['$event'])
  listenForValueChange(event: Event): void {
    event.preventDefault();

    // this.#rovingTabindexController.focus();
  }

  // #rovingTabindexController = new RovingTabindexController<Radio>(this.elementRef.nativeElement, {
  //   focusInIndex: (elements: Radio[]) => {
  //     return elements.findIndex(el => {
  //       return this.value ? !el.disabled && el.value === this.value : !el.disabled;
  //     });
  //   },
  //   elementEnterAction: (el: Radio) => {
  //     this.value = el.value;
  //   },
  //   elements: () => this.elementRef.nativeElement.buttons as Radio[],
  //   isFocusableElement: (el: Radio) => !el.disabled
  // });
}
