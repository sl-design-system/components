import type { PropertyValues, ReactiveElement } from 'lit';
import type { Constructor } from '../types.js';
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

    /** Whether the form control is disabled; when set no interaction is possible. */
    @property({ type: Boolean, reflect: true }) disabled?: boolean;

    /** The name of the form control. */
    @property({ reflect: true }) name?: string;

    /** Whether this form control is a required field. */
    @property({ type: Boolean, reflect: true }) required?: boolean;

    /** @ignore For internal use only */
    get formControlElement(): FormControlElement {
      if (this.#formControlElement) {
        return this.#formControlElement;
      } else {
        throw new Error('A formControlElement must be set for the FormControlMixin to work');
      }
    }

    /** Native form property. */
    get form(): HTMLFormElement | null {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.form;
      } else {
        return this.formControlElement.internals.form;
      }
    }

    /** Native labels property.
     * @type {`NodeListOf<HTMLLabelElement>` | null}
     */
    get labels(): NodeListOf<HTMLLabelElement> | null {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.labels;
      } else {
        return this.formControlElement.internals.labels as NodeListOf<HTMLLabelElement>;
      }
    }

    /** @ignore */
    override shouldUpdate(changes: PropertyValues<this>): boolean {
      if (super.shouldUpdate(changes)) {
        if (changes.has('disabled') && isNative(this.formControlElement)) {
          if (this.disabled) {
            this.formControlElement.setAttribute('disabled', '');
          } else {
            this.formControlElement.removeAttribute('disabled');
          }
        }
        return true;
      }
      return false;
    }

    /** @ignore */
    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('name') && isNative(this.formControlElement)) {
        this.formControlElement.name = this.name ?? '';
      }

      if (changes.has('required') && isNative(this.formControlElement)) {
        this.formControlElement.toggleAttribute('required', this.required);
      }
    }

    /**  Method returns a boolean value which indicates validity of the value of the element. */
    checkValidity(): boolean {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.checkValidity();
      } else {
        return this.formControlElement.internals.checkValidity();
      }
    }

    /** Method that checks the validity of a form element and reports validation constraints or errors associated with it. The method works similar to checkValidity() function. */
    reportValidity(): boolean {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.reportValidity();
      } else {
        return this.formControlElement.internals.reportValidity();
      }
    }

    /** @ignore Native ElementInternals helper function. */
    setFormControlElement(element: FormControlElement): void {
      this.#formControlElement = element;
    }

    /** @ignore Native ElementInternals function. */
    setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void {
      console.log('setValidity', { flags, message, anchor });
    }

    // /** Method used to set the value of the form element.
    //  * @type {`File` | `FormData` | `string` | `undefined`}
    //  * */
    /** Method used to set the value of the form element.
     * @param {`value` `File` | null}
     */
    setFormValue(value?: FormControlValue): void {
      // TODO: change properties type, how?
      this.#cachedValue = value;

      if (isNative(this.formControlElement)) {
        this.formControlElement.value = value?.toString() ?? '';
      } else {
        this.formControlElement.internals.setFormValue(value ?? null);
      }
    }
  }

  return FormControl;
}
