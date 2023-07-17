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
import { RovingTabindexController } from '@sl-design-system/shared';

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

  #initialValue: string | undefined;

  #value: string | undefined;

  get value(): string | undefined {
    return this.#value;
  }

  set value(val: string | undefined) {
    this.#value = val;
    this.onChange(this.#value);
    (this.elementRef.nativeElement.buttons as Radio[])?.forEach((radio: Radio) => (radio.checked = radio.value === this.value));
    this.elementRef.nativeElement.internals.value = this.#value;
    this.validatorOnChange();
  }

  writeValue(value: string | undefined): void {
    value = value ? value : undefined;
    this.#initialValue = value;
    if (value) {
      (this.elementRef.nativeElement.buttons as Radio[])?.forEach((radio: Radio) => (radio.checked = radio.value === this.value));
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

    this.#rovingTabindexController.focus();
  }

  #rovingTabindexController = new RovingTabindexController<Radio>(this.elementRef.nativeElement, {
    focusInIndex: (elements: Radio[]) => {
      return elements.findIndex(el => {
        return this.value ? !el.disabled && el.value === this.value : !el.disabled;
      });
    },
    elementEnterAction: (el: Radio) => {
      this.value = el.value;
    },
    elements: () => this.elementRef.nativeElement.buttons as Radio[],
    isFocusableElement: (el: Radio) => !el.disabled
  });
}
