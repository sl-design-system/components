import type { PropertyValues, ReactiveElement } from 'lit';
import type { Constructor } from '@sl-design-system/shared';
import { property, state } from 'lit/decorators.js';
import styles from './form-control-mixin.scss.js';

export interface NativeFormControlElement extends HTMLElement {
  form: HTMLFormElement | null;
  labels: NodeListOf<HTMLLabelElement> | null;
  name: string;
  validationMessage: string;
  validity: ValidityState;

  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}

export interface CustomFormControlElement extends HTMLElement {
  internals: ElementInternals;
}

export type FormControlElement = NativeFormControlElement | CustomFormControlElement;

export interface FormControlInterface {
  readonly form: HTMLFormElement | null;
  readonly formControlElement: FormControlElement;
  readonly labels: NodeListOf<HTMLLabelElement> | null;
  readonly showValidity?: 'valid' | 'invalid';
  readonly valid: boolean;
  readonly validationMessage: string;
  readonly validity: ValidityState;

  errorText?: string;
  hintText?: string;
  name?: string;

  reportValidity(): boolean;
  updateValidity(): void;

  setCustomValidity(message: string): void;
  setFormControlElement(element: FormControlElement): void;
}

let nextUniqueId = 0;

const isNative = (element: FormControlElement): element is NativeFormControlElement =>
  element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;

export function FormControlMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<FormControlInterface> {
  class FormControl extends constructor {
    /** The element containing the error message that is slotted into the `error` slot. */
    #errorElement?: HTMLElement;

    /**
     * The actual element that integrates with the form; either
     * a Form Associated Custom Element, an `<input>` or a `<textarea>`.
     */
    #formControlElement?: FormControlElement;

    /** The element containing the hint text that is slotted into the `hint` slot. */
    #hintElement?: HTMLElement;

    #onInvalid = (event: Event): void => {
      // Prevent the browser from showing the built-in validation UI
      event.preventDefault();

      // Due to not knowing when to show the validation message, we'll just show it now
      // See https://github.com/whatwg/html/issues/9878
      this.report = true;
    };

    /** An error text that will be shown over any other validation messages. */
    @property({ attribute: 'error-text' }) errorText?: string;

    /** A hint text that will be shown when there are no validation messages. */
    @property({ attribute: 'hint-text' }) hintText?: string;

    /** The name of the form control. */
    @property({ reflect: true }) name?: string;

    /** Whether the form control should report the validity of the control. */
    @state() report?: boolean;

    /** Whether to show the validity state. */
    @property({ attribute: 'show-validity', reflect: true }) showValidity?: 'valid' | 'invalid';

    /** @ignore For internal use only */
    get formControlElement(): FormControlElement {
      if (this.#formControlElement) {
        return this.#formControlElement;
      } else {
        throw new Error('A formControlElement must be set for the FormControlMixin to work');
      }
    }

    /** The form associated with the control. */
    get form(): HTMLFormElement | null {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.form;
      } else {
        return this.formControlElement.internals.form;
      }
    }

    /**
     * The labels associated with the control.
     * @type {`NodeListOf<HTMLLabelElement>` | null}
     */
    get labels(): NodeListOf<HTMLLabelElement> | null {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.labels;
      } else {
        return this.formControlElement.internals.labels as NodeListOf<HTMLLabelElement>;
      }
    }

    /** Returns whether the from control is valid or not. */
    get valid(): boolean {
      return this.validity.valid;
    }

    /**
     * String representing a localized message that describes the validation constraints
     * that the control does not satisfy (if any). The string is empty if the control is
     * not a candidate for constraint validation, or it satisfies its constraints.
     */
    get validationMessage(): string {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.validationMessage;
      } else {
        return this.formControlElement.internals.validationMessage;
      }
    }

    /** Returns the validity state the control is in. */
    get validity(): ValidityState {
      if (isNative(this.formControlElement)) {
        return this.formControlElement.validity;
      } else {
        return this.formControlElement.internals.validity;
      }
    }

    /** @ignore */
    override disconnectedCallback(): void {
      this.#formControlElement?.removeEventListener('invalid', this.#onInvalid);
      this.#formControlElement = undefined;

      super.disconnectedCallback();
    }

    /** @ignore */
    override willUpdate(changes: PropertyValues<this>): void {
      super.willUpdate(changes);

      if (changes.has('report')) {
        this.updateValidity();
      }
    }

    /** @ignore */
    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('errorText')) {
        this.#setErrorText(this.errorText || this.validationMessage);
      }

      if (changes.has('hintText')) {
        this.#setHintText(this.hintText);
      }

      if (changes.has('name') && isNative(this.formControlElement)) {
        this.formControlElement.name = this.name ?? '';
      }
    }

    /**
     * Returns whether the control is valid. If the control is invalid, calling this will
     * also cause an `invalid` event to be dispatched. After calling this, the control
     * will also report the validity to the user.
     */
    reportValidity(): boolean {
      return isNative(this.formControlElement)
        ? this.formControlElement.reportValidity()
        : this.formControlElement.internals.reportValidity();
    }

    /**
     * Updates the validity of the form control. This does not *change* the `validity` of the
     * form control, it just updates the display of any validation message. Changing the validity
     * is up to the form control itself.
     *
     * NOTE: This method updates the `showValidity` property and therefore should be called from
     * `willUpdate`, never from `updated` or you will trigger a new lifecycle update.
     */
    updateValidity(): void {
      this.showValidity = this.report ? (this.valid ? 'valid' : 'invalid') : undefined;
      this.#setErrorText(this.errorText ?? this.validationMessage);
    }

    /**
     * Set's a custom validation message for the form control. If the message
     * is not an empty string, that will make the control invalid. By setting it to
     * an empty string again, you can make the control valid again.
     * @param message The validation message.
     */
    setCustomValidity(message: string): void {
      if (isNative(this.formControlElement)) {
        this.formControlElement.setCustomValidity(message);
      } else {
        if (message === '') {
          this.formControlElement.internals.setValidity({});
        } else {
          this.formControlElement.internals.setValidity({ customError: true }, message);
        }
      }

      this.updateValidity();
    }

    /**
     * This tells the mixin what the form control element is. This can either be a native input
     * or textarea element, or a Form Associated Custom Element (FACE) with an internals property.
     *
     * The form control element must be either the same as the FormControlMixin host (in the case of
     * a FACE), or a child of it. Otherwise we can't link the validation message to the form control
     * element, which is necessary for accessibility.
     * @param element The form control element.
     */
    setFormControlElement(element: FormControlElement): void {
      this.#formControlElement = element;
      this.#formControlElement.addEventListener('invalid', this.#onInvalid);
    }

    #setErrorText(text: string = ''): void {
      if (!text && !this.#errorElement) {
        return;
      }

      this.#errorElement ??= document.createElement('div');
      this.#errorElement.id ||= `sl-error-${nextUniqueId++}`;
      this.#errorElement.innerText = text;
      this.#errorElement.slot ||= 'error-text';

      const ids = this.formControlElement.getAttribute('aria-describedby')?.split(' ') ?? [];
      if (!ids.includes(this.#errorElement.id)) {
        this.formControlElement.setAttribute('aria-describedby', [...ids, this.#errorElement.id].join(' '));
      }

      // The error is added to the light DOM so that it can be linked to by the aria-describedby
      // attribute. This is necessary for accessibility.
      if (!this.#errorElement.parentElement) {
        this.append(this.#errorElement);
      }
    }

    #setHintText(text: string = ''): void {
      if (!text && !this.#hintElement) {
        return;
      }

      this.#hintElement ??= document.createElement('div');
      this.#hintElement.id ||= `sl-hint-${nextUniqueId++}`;
      this.#hintElement.innerText = text;
      this.#hintElement.slot ||= 'hint-text';

      const ids = this.formControlElement.getAttribute('aria-describedby')?.split(' ') ?? [];
      if (!ids.includes(this.#hintElement.id)) {
        this.formControlElement.setAttribute('aria-describedby', [...ids, this.#hintElement.id].join(' '));
      }

      // The hint is added to the light DOM so that it can be linked to by the aria-describedby
      // attribute. This is necessary for accessibility.
      if (!this.#hintElement.parentElement) {
        this.append(this.#hintElement);
      }
    }
  }

  return FormControl;
}

FormControlMixin.styles = styles;
