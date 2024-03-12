import { msg } from '@lit/localize';
import { type Constructor } from '@sl-design-system/shared';
import { type PropertyValues, type ReactiveElement } from 'lit';
import { property } from 'lit/decorators.js';
import { UpdateValidityEvent } from './update-validity-event.js';
import { ValidateEvent } from './validate-event.js';

// Handle differences in the first argument of setFormValue between typescript versions
export type FormValue = Parameters<ElementInternals['setFormValue']>[0];

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

export type FormControlShowValidity = 'valid' | 'invalid' | undefined;

export type FormControlValidityState = 'valid' | 'invalid' | 'pending';

export interface FormControl {
  readonly form: HTMLFormElement | null;
  readonly formControlElement: FormControlElement;
  readonly labels: NodeListOf<HTMLLabelElement> | null;
  readonly nativeFormValue: FormValue;
  readonly required?: boolean;
  readonly showExternalValidityIcon: boolean;
  readonly showValidity: FormControlShowValidity;
  readonly valid: boolean;
  readonly validationMessage: string;
  readonly validity: ValidityState;
  readonly validityState: FormControlValidityState;

  customValidity?: string;
  disabled?: boolean;
  formValue: unknown;
  name?: string;
  showValid?: boolean;
  value?: unknown;

  reportValidity(): boolean;
  updateValidity(): void;

  getLocalizedValidationMessage(): string;
  setCustomValidity(message: string | Promise<string>): void;
  setFormControlElement(element: FormControlElement): void;
}

const isNative = (element: FormControlElement): element is NativeFormControlElement =>
  element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;

/**
 * Mixin that adds form control functionality to a component.
 *
 * @slot error-text - The error text to display
 * @slot hint-text - The hint text to display
 */
export function FormControlMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<FormControl> {
  class FormControlImpl extends constructor {
    /**
     * This is necessary so we can check if an element implements this Mixin, since the
     * `FormControl` class isn't a generic class we can use in an `instanceof` comparison.
     * @ignore
     */
    static readonly extendsFormControlMixin = true;

    /** The promise that resolves into a custom validity message. */
    #customValidityPromise?: Promise<string>;

    /**
     * The actual element that integrates with the form; either
     * a Form Associated Custom Element, an `<input>` or a `<textarea>`.
     */
    #formControlElement?: FormControlElement;

    #onInvalid = (event: Event): void => {
      // Prevent the browser from showing the built-in validation UI
      event.preventDefault();

      // Due to not knowing when to show the validation message, we'll just show it now
      // See https://github.com/whatwg/html/issues/9878
      if (!this.report) {
        this.report = true;
        this.updateValidity();
      }
    };

    /** @ignore Whether the form control should report the validity of the control. */
    report?: boolean;

    /** @ignore This determines whether the `<sl-error>` component displays an icon or not. */
    showExternalValidityIcon = true;

    /** Optional property to indicate the valid state should be shown. */
    showValid = false;

    /** The value for this form control. */
    value?: unknown;

    /** The error message to display when the control is invalid. */
    @property({ attribute: 'custom-validity' }) customValidity?: string;

    /** The name of the form control. */
    @property({ reflect: true }) name?: string;

    /** Whether to show the validity state.
     * @type {'valid' | 'invalid' | undefined }
     */
    @property({ attribute: 'show-validity', reflect: true }) showValidity: FormControlShowValidity;

    /** The value used when submitting the form. */
    get formValue(): unknown {
      return this.value;
    }

    @property({ attribute: false })
    set formValue(value: unknown) {
      this.value = value;
    }

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

    get nativeFormValue(): FormValue {
      if (
        this.formValue === null ||
        this.formValue === undefined ||
        this.formValue instanceof File ||
        this.formValue instanceof FormData ||
        typeof this.formValue === 'string'
      ) {
        return this.formValue ?? null;
      } else if (typeof this.formValue === 'boolean') {
        return Boolean(this.formValue).toString();
      } else if (typeof this.formValue === 'number') {
        return Number(this.formValue).toString();
      } else if (typeof this.formValue === 'object' && 'toString' in this.formValue) {
        return (this.formValue as { toString(): string }).toString();
      } else {
        console.warn('Unknown form value type', this.formValue);

        return null;
      }
    }

    /** Returns whether the form control is valid or not. */
    get valid(): boolean {
      return this.validity.valid;
    }

    /**
     * String representing a localized (by the browser) message that describes the validation
     * constraints that the control does not satisfy (if any). The string is empty if the control
     * is not a candidate for constraint validation, or it satisfies its constraints.
     *
     * For true localization, see `getLocalizedValidationMessage()` instead.
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

    /** Returns the current validity state.
     * @type { 'valid' | 'invalid' | 'pending'}
     */
    get validityState(): FormControlValidityState {
      return this.#customValidityPromise ? 'pending' : this.valid ? 'valid' : 'invalid';
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

      if (changes.has('customValidity')) {
        this.setCustomValidity(this.customValidity ?? '');
      }
    }

    /** @ignore */
    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('name') && isNative(this.formControlElement)) {
        this.formControlElement.name = this.name ?? '';
      }

      if (changes.has('showValidity')) {
        if (isNative(this.formControlElement)) {
          if (this.showValidity === 'invalid') {
            this.formControlElement.setAttribute('aria-invalid', 'true');
          } else {
            this.formControlElement.removeAttribute('aria-invalid');
          }
        } else {
          this.formControlElement.internals.ariaInvalid = this.showValidity === 'invalid' ? 'true' : null;
        }
      }
    }

    /**
     * Returns whether the control is valid. If the control is invalid, calling this will
     * also cause an `invalid` event to be dispatched. After calling this, the control
     * will also report the validity to the user.
     */
    reportValidity(): boolean {
      // Workaround for https://github.com/whatwg/html/issues/9878
      this.report = true;

      const valid = isNative(this.formControlElement)
        ? this.formControlElement.reportValidity()
        : this.formControlElement.internals.reportValidity();

      this.updateValidity();

      return valid;
    }

    /**
     * Updates the validity of the form control. This does not *change* the `validity` of the
     * form control, it just updates the display of any validation message. Changing the validity
     * is up to the form control itself.
     *
     * NOTE: This method updates the `showValidity` property and therefore should be called from
     * `willUpdate`, never from `updated` or you will trigger a new lifecycle update.
     * @ignore
     */
    updateValidity(emitValidateEvent = true): void {
      if (emitValidateEvent) {
        // Emit the validate event so custom validation can be run at the right time
        this.dispatchEvent(new ValidateEvent());
      }

      if (this.report) {
        if (this.valid) {
          this.showValidity = this.showValid ? 'valid' : undefined;
        } else {
          this.showValidity = 'invalid';
        }
      }

      this.#emitValidityUpdate();
    }

    /**
     * This returns a localized validation message. It does not support all `ValidityState` properties,
     * since some require more context than we have here. If you need to support more, you can override
     * this method in your own form control.
     */
    getLocalizedValidationMessage(): string {
      if (!isNative(this.formControlElement) || this.validity.valid || this.validity.customError) {
        return this.validationMessage;
      } else if (this.validity.badInput || this.validity.typeMismatch) {
        return msg('Please enter a valid value.');
      } else if (this.validity.patternMismatch) {
        return msg('Please match the format requested.');
      } else if (this.validity.valueMissing) {
        return msg('Please fill in this field.');
      } else {
        let missingKey = '';
        for (const key in this.validity) {
          if (this.validity[key as keyof ValidityState] === true) {
            missingKey = key;
            break;
          }
        }

        console.warn(
          `Missing localized validation message for validity state "${missingKey}". Provide your own getLocalizedValidationMessage() method in your form control.`
        );

        return this.validationMessage;
      }
    }

    /**
     * Sets a custom validation message for the form control. If the message
     * is not an empty string, that will make the control invalid. By setting it to
     * an empty string again, you can make the control valid again.
     * @param message The validation message.
     */
    setCustomValidity(message: string | Promise<string>): void {
      if (typeof message !== 'string') {
        this.#customValidityPromise = message;

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        message
          .then(result => this.setCustomValidity(result))
          .finally(() => {
            this.#customValidityPromise = undefined;
          });

        return;
      }

      if (isNative(this.formControlElement)) {
        this.formControlElement.setCustomValidity(message);
      } else {
        if (message === '') {
          this.formControlElement.internals.setValidity({});
        } else {
          this.formControlElement.internals.setValidity({ customError: true }, message);
        }
      }

      this.updateValidity(false);
    }

    /**
     * This tells the mixin what the form control element is. This can either be a native input
     * or textarea element, or a Form Associated Custom Element (FACE) with an internals property.
     *
     * The form control element must be either the same as the FormControlMixin host (in the case of
     * a FACE), or a child of it. Otherwise we can't link the validation message to the form control
     * element, which is necessary for accessibility.
     * @param element The form control element.
     * @ignore
     */
    setFormControlElement(element: FormControlElement): void {
      this.#formControlElement = element;
      this.#formControlElement.addEventListener('invalid', this.#onInvalid);
    }

    /** Emits an event so the form-field can update itself. */
    #emitValidityUpdate(): void {
      this.dispatchEvent(new UpdateValidityEvent(this.valid, this.getLocalizedValidationMessage(), this.showValidity));
    }
  }

  return FormControlImpl;
}
