import type { IElementInternals } from 'element-internals-polyfill';
import type { ReactiveElement, TemplateResult } from 'lit';
import type { Constructor } from '../mixin-types.js';
import { localized, msg, str } from '@lit/localize';
import { html } from 'lit';
import { state } from 'lit/decorators.js';
import { EventsController } from '../controllers/events.js';

export interface ValidationInterface {
  readonly form: HTMLFormElement | null;
  readonly invalid: boolean;
  readonly validity: ValidityState;

  validationHost: ValidationHost;

  checkValidity(): boolean;
  reportValidity(): boolean;

  renderValidation(): TemplateResult | undefined;
}

export interface NativeValidationHost extends EventTarget {
  form: HTMLFormElement | null;
  validationMessage: string;
  validity: ValidityState;

  checkValidity(): boolean;
  reportValidity(): boolean;
}

export interface CustomValidationHost extends EventTarget {
  internals: ElementInternals & IElementInternals;
}

export type ValidationHost = NativeValidationHost | CustomValidationHost;

const isNativeValidationHost = (host: ValidationHost): host is NativeValidationHost => 'checkValidity' in host;

export function ValidationMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<ValidationInterface> {
  @localized()
  class Validation extends constructor {
    /** Events manager. */
    #events = new EventsController(this);

    /** Event handler for when invalid validity must be reported. */
    #onInvalid = (event: Event): void => {
      // Prevent the browser from showing the built-in validation UI
      event.preventDefault();

      this.invalid = !this.validity.valid;
    };

    /** The host element which the validation is based on. */
    #validationHost?: ValidationHost;

    /** Whether the element has been invalidated. */
    @state() invalid = false;

    get form(): HTMLFormElement | null {
      if (isNativeValidationHost(this.validationHost)) {
        return this.validationHost.form;
      } else {
        return this.validationHost.internals.form;
      }
    }

    get validationHost(): ValidationHost {
      if (this.#validationHost) {
        return this.#validationHost;
      } else {
        throw new Error('A validationHost must be set for the ValidationMixin to work');
      }
    }

    set validationHost(host: ValidationHost) {
      if (this.#validationHost) {
        this.#validationHost.removeEventListener('invalid', this.#onInvalid);
      }

      this.#validationHost = host;
      this.#validationHost.addEventListener('invalid', this.#onInvalid);
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

    #onReset(event: Event): void {
      if (this.form === event.target) {
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
  }

  return Validation;
}
