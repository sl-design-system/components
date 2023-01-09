import type { IElementInternals } from 'element-internals-polyfill';
import type { CSSResultGroup, PropertyValues, ReactiveElement, TemplateResult } from 'lit';
import type { Constructor } from '../mixin-types.js';
import { localized, msg, str } from '@lit/localize';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { EventsController } from '../controllers/events.js';
import styles from './validation-mixin.scss.js';

export const validationStyles: CSSResultGroup = styles;

export interface NativeValidationHost extends HTMLElement {
  readonly form: HTMLFormElement | null;

  validationMessage: string;
  validity: ValidityState;

  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}

export interface CustomValidationHost extends HTMLElement {
  internals: ElementInternals & IElementInternals;
}

export type ValidationHost = NativeValidationHost | CustomValidationHost;

export type FormControlValue = string | File | FormData;

export interface ValidationInterface {
  readonly invalid: boolean;
  readonly validationHost: ValidationHost;
  readonly validity: ValidityState;

  value: FormControlValue | null;

  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;

  renderValidation(): TemplateResult | undefined;
  setValidationHost(host: ValidationHost): void;
  shouldFormValueUpdate(): boolean;
}

const isNativeValidationHost = (host: ValidationHost): host is NativeValidationHost => 'setSelectionRange' in host;

export function ValidationMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<ValidationInterface> {
  @localized()
  class Validation extends constructor {
    /** Events manager. */
    #events = new EventsController(this);

    /** Whether the control has had focus. */
    #focused = false;

    #onBlur = (): void => {
      this.#focused = true;

      this.#runValidators(this.shouldFormValueUpdate() ? this.value : '');
    };

    /** Event handler for when invalid validity must be reported. */
    #onInvalid = (event: Event): void => {
      console.log('#onInvalid');

      // Prevent the browser from showing the built-in validation UI
      event.preventDefault();

      this.invalid = !this.validity.valid;
    };

    /** The host element which the validation is based on. */
    #validationHost?: ValidationHost;

    /** Whether the element has been invalidated. */
    @state() invalid = false;

    /** The value of the validation host. */
    @property() value: FormControlValue | null = null;

    get validationHost(): ValidationHost {
      if (this.#validationHost) {
        return this.#validationHost;
      } else {
        throw new Error('A validationHost must be set for the ValidationMixin to work');
      }
    }

    get validationMessage(): string {
      if (isNativeValidationHost(this.validationHost)) {
        return this.validationHost.validationMessage;
      } else {
        return this.validationHost.internals.validationMessage;
      }
    }

    get validity(): ValidityState {
      if (isNativeValidationHost(this.validationHost)) {
        return this.validationHost.validity;
      } else {
        return this.validationHost.internals.validity;
      }
    }

    override connectedCallback(): void {
      super.connectedCallback();

      this.#events.listen(document, 'reset', this.#onReset);
    }

    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('invalid') && 'internals' in this) {
        const internals = this.internals as ElementInternals & IElementInternals;

        if (this.invalid) {
          internals.states.add('--invalid');
        } else {
          internals.states.delete('--invalid');
        }

        // If the element has no title attribute, then add one, otherwise
        // the native `validationMessage` will be shown in a native tooltip.
        if (isNativeValidationHost(this.validationHost) && !this.validationHost.hasAttribute('title')) {
          this.validationHost.setAttribute('title', '');
        }
      }
    }

    checkValidity(): boolean {
      if (isNativeValidationHost(this.validationHost)) {
        return this.validationHost.checkValidity();
      } else {
        return this.validationHost.internals.checkValidity();
      }
    }

    reportValidity(): boolean {
      if (isNativeValidationHost(this.validationHost)) {
        return this.validationHost.reportValidity();
      } else {
        return this.validationHost.internals.reportValidity();
      }
    }

    setCustomValidity(message: string): void {
      if (isNativeValidationHost(this.validationHost)) {
        this.validationHost.setCustomValidity(message);
      } else {
        this.validationHost.internals.setValidity({ customError: true }, message);
      }
    }

    renderValidation(): TemplateResult | undefined {
      const state = this.#getInvalidState(this.validity);

      if (!this.invalid || !state) {
        return;
      }

      let validationMessage = '';
      switch (state) {
        case 'custom-error':
          validationMessage = this.validationMessage;
          break;
        case 'pattern-mismatch':
          validationMessage = msg('Please match the specified pattern.');
          break;
        case 'too-short':
          if ('minLength' in this) {
            const count = this.minLength ?? 0;

            validationMessage = msg(str`This field must be at least ${count} character${count > 1 ? 's' : ''} long.`);
          }
          break;
        case 'value-missing':
          validationMessage = msg('This field must be filled in.');
          break;
      }

      return html`<slot .name=${state} part="error">${validationMessage}</slot>`;
    }

    setValidationHost(host: ValidationHost): void {
      if (this.#validationHost) {
        this.#validationHost.removeEventListener('blur', this.#onBlur);
        this.#validationHost.removeEventListener('invalid', this.#onInvalid);
      }

      this.#validationHost = host;
      this.#validationHost.addEventListener('blur', this.#onBlur);
      this.#validationHost.addEventListener('invalid', this.#onInvalid);
    }

    shouldFormValueUpdate(): boolean {
      return true;
    }

    #onReset(event: Event): void {
      const { form } = isNativeValidationHost(this.validationHost)
        ? this.validationHost
        : this.validationHost.internals;

      if (form === event.target) {
        this.invalid = false;
      }
    }

    #getInvalidState(validity: ValidityState): string | undefined {
      if (validity.badInput) {
        return 'bad-input';
      } else if (validity.customError) {
        return 'custom-error';
      } else if (validity.patternMismatch) {
        return 'pattern-mismatch';
      } else if (validity.rangeOverflow) {
        return 'range-overflow';
      } else if (validity.rangeUnderflow) {
        return 'range-underflow';
      } else if (validity.stepMismatch) {
        return 'step-mismatch';
      } else if (validity.tooLong) {
        return 'too-long';
      } else if (validity.tooShort) {
        return 'too-short';
      } else if (validity.typeMismatch) {
        return 'type-mismatch';
      } else if (validity.valueMissing) {
        return 'value-missing';
      }
    }

    #runValidators(value: FormControlValue | null): void {
      console.log('runValidators', { value });
    }
  }

  return Validation;
}
