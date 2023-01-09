import type { PropertyValues, ReactiveElement } from 'lit';
import type { Constructor } from '../mixin-types.js';
import type { HintInterface } from './hint-mixin.js';
import type {
  CustomValidationHost,
  FormControlValue,
  NativeValidationHost,
  ValidationInterface
} from './validation-mixin.js';
import type { IElementInternals } from 'element-internals-polyfill';
import { property } from 'lit/decorators.js';
import { HintMixin } from './hint-mixin.js';
import { ValidationMixin } from './validation-mixin.js';

export interface NativeFormControlElement extends NativeValidationHost {
  form: HTMLFormElement | null;
  labels: NodeListOf<HTMLLabelElement> | null;
  name: string;
  value: FormControlValue;
}

export interface CustomFormControlElement extends CustomValidationHost {
  internals: ElementInternals & IElementInternals;
}

export type FormControlElement = NativeFormControlElement | CustomFormControlElement;

export interface FormControlInterface extends HintInterface, ValidationInterface {
  readonly form: HTMLFormElement | null;
  readonly formControlElement: FormControlElement;
  readonly labels: NodeListOf<HTMLLabelElement> | null;

  disabled?: boolean;
  name?: string;
  required?: boolean;
  value: FormControlValue | null;

  setFormControlElement(element: FormControlElement): void;
  setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
}

const isNativeFormControlElement = (element: FormControlElement): element is NativeFormControlElement =>
  'setSelectionRange' in element;

export function FormControlMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<FormControlInterface> {
  class FormControl extends ValidationMixin(HintMixin(constructor)) {
    /** The cached value for the form control. */
    #cachedValue: FormControlValue | null = null;

    /**
     * The actual element that integrates with the form; either
     * a Form Associated Custom Element, or an `<input>` or `<textarea>`.
     */
    #formControlElement?: FormControlElement;

    /** No interaction is possible with this control when disabled. */
    @property({ type: Boolean, reflect: true }) disabled?: boolean;

    /** The name of the form control. */
    @property() name?: string;

    /** Whether this form control is a required field. */
    @property({ type: Boolean }) required?: boolean;

    get formControlElement(): FormControlElement {
      if (this.#formControlElement) {
        return this.#formControlElement;
      } else {
        throw new Error('A formControlElement must be set for the FormControlMixin to work');
      }
    }

    get form(): HTMLFormElement | null {
      if (isNativeFormControlElement(this.formControlElement)) {
        return this.formControlElement.form;
      } else {
        return this.formControlElement.internals.form;
      }
    }

    get labels(): NodeListOf<HTMLLabelElement> | null {
      if (isNativeFormControlElement(this.formControlElement)) {
        return this.formControlElement.labels;
      } else {
        return this.formControlElement.internals.labels;
      }
    }

    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('disabled') && isNativeFormControlElement(this.formControlElement)) {
        this.formControlElement.toggleAttribute('disabled', this.disabled);
      }

      if (changes.has('name') && isNativeFormControlElement(this.formControlElement)) {
        this.formControlElement.name = this.name ?? '';
      }

      if (changes.has('required')) {
        this.formControlElement.toggleAttribute('required', this.required);
      }

      if (changes.has('value') && this.value !== this.#cachedValue) {
        this.#cachedValue = this.value;

        if (isNativeFormControlElement(this.formControlElement)) {
          this.formControlElement.value = this.value?.toString() ?? '';
        } else {
          this.formControlElement.internals.setFormValue(this.value);
        }
      }
    }

    setFormControlElement(element: FormControlElement): void {
      this.#formControlElement = element;

      this.setValidationHost(element);
    }

    setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void {
      console.log('setValidity', { flags, message, anchor });
    }
  }

  return FormControl;
}
