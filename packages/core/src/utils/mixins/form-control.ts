import type { PropertyValues, ReactiveElement } from 'lit';
import type { Constructor } from './types.js';
import type { ValidationValue } from '../validators.js';
import { property } from 'lit/decorators.js';

export type FormControlValue = ValidationValue;

export interface NativeFormControlElement extends HTMLElement {
  form: HTMLFormElement | null;
  labels: NodeListOf<HTMLLabelElement> | null;
  name: string;
  value?: FormControlValue;

  checkValidity(): boolean;
  reportValidity(): boolean;
}

export interface CustomFormControlElement extends HTMLElement {
  internals: ElementInternals;
}

export type FormControlElement = NativeFormControlElement | CustomFormControlElement;

export interface FormControlInterface {
  readonly form: HTMLFormElement | null;
  readonly formControlElement: FormControlElement;
  readonly labels: NodeListOf<HTMLLabelElement> | null;

  disabled?: boolean;
  name?: string;
  required?: boolean;

  checkValidity(): boolean;
  reportValidity(): boolean;
  setFormControlElement(element: FormControlElement): void;
  setFormValue(value?: FormControlValue): void;
  setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
}

const isNative = (element: FormControlElement): element is NativeFormControlElement =>
  element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;

export function FormControlMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<FormControlInterface> {
  class FormControl extends constructor {
    /** The cached value for the form control. */
    #cachedValue?: FormControlValue;

    /**
     * The actual element that integrates with the form; either
     * a Form Associated Custom Element, or an `<input>` or `<textarea>`.
     */
    #formControlElement?: FormControlElement;

    /** No interaction is possible with this control when disabled. */
    @property({ type: Boolean, reflect: true }) disabled?: boolean;

    /** The name of the form control. */
    @property({ reflect: true }) name?: string;

    /** Whether this form control is a required field. */
    @property({ type: Boolean, reflect: true }) required?: boolean;

    get formControlElement(): FormControlElement {
      if (this.#formControlElement) {
        return this.#formControlElement;
      } else {
        throw new Error('A formControlElement must be set for the FormControlMixin to work');
      }
    }

    get form(): HTMLFormElement | null {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.form;
      } else {
        return this.formControlElement.internals.form;
      }
    }

    get labels(): NodeListOf<HTMLLabelElement> | null {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.labels;
      } else {
        return this.formControlElement.internals.labels as NodeListOf<HTMLLabelElement>;
      }
    }

    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('disabled') && isNative(this.formControlElement)) {
        this.formControlElement.toggleAttribute('disabled', this.disabled);
      }

      if (changes.has('name') && isNative(this.formControlElement)) {
        this.formControlElement.name = this.name ?? '';
      }

      if (changes.has('required') && isNative(this.formControlElement)) {
        this.formControlElement.toggleAttribute('required', this.required);
      }

      // if (changes.has('value') && this.value !== this.#cachedValue) {
      //   this.#cachedValue = this.value;

      //   if (isNative(this.formControlElement)) {
      //     this.formControlElement.value = this.value?.toString() ?? '';
      //   } else {
      //     this.formControlElement.internals.setFormValue(this.value ?? null);
      //   }
      // }
    }

    checkValidity(): boolean {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.checkValidity();
      } else {
        return this.formControlElement.internals.checkValidity();
      }
    }

    reportValidity(): boolean {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.reportValidity();
      } else {
        return this.formControlElement.internals.reportValidity();
      }
    }

    setFormControlElement(element: FormControlElement): void {
      this.#formControlElement = element;
    }

    setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void {
      console.log('setValidity', { flags, message, anchor });
    }

    setFormValue(value?: FormControlValue): void {
      this.#cachedValue = value;

      const valueShouldUpdate = true, //this.shouldFormValueUpdate(),
        valueToUpdate = valueShouldUpdate ? value : null;

      if (isNative(this.formControlElement)) {
        this.formControlElement.value = valueToUpdate?.toString() ?? '';
      } else {
        this.formControlElement.internals.setFormValue(valueToUpdate ?? null);
      }
    }
  }

  return FormControl;
}
