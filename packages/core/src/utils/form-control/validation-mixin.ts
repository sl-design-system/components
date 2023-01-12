/* eslint-disable @typescript-eslint/no-floating-promises */
import type { IElementInternals } from 'element-internals-polyfill';
import type { CSSResultGroup, PropertyValues, ReactiveElement, TemplateResult } from 'lit';
import type { Constructor } from '../mixin-types.js';
import type { Validator } from './validators.js';
import { localized, msg, str } from '@lit/localize';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { EventsController } from '../controllers/events.js';
import styles from './validation-mixin.scss.js';

export type CustomValidityState = Partial<Record<keyof ValidityState, boolean>>;

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

  validators: Validator[];
  value: FormControlValue | null;

  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;

  renderValidation(): TemplateResult | undefined;
  setValidationHost(host: ValidationHost): void;
  shouldFormValueUpdate(): boolean;
  validate(): void;
}

export const validationStyles: CSSResultGroup = styles;

const isNativeValidationHost = (host: ValidationHost): host is NativeValidationHost =>
  host instanceof HTMLInputElement || host instanceof HTMLTextAreaElement;

export function ValidationMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<ValidationInterface> {
  @localized()
  class Validation extends constructor {
    /** An internal abort controller for cancelling pending async validation. */
    #abortController?: AbortController;
    #previousAbortController?: AbortController;

    /** Events manager. */
    #events = new EventsController(this);

    /** Whether the control has had focus. */
    #focused = false;

    #onBlur = (): void => {
      this.#focused = true;

      this.validate();
    };

    /** Event handler for when invalid validity must be reported. */
    #onInvalid = (event: Event): void => {
      console.log('#onInvalid');

      // Prevent the browser from showing the built-in validation UI
      event.preventDefault();

      this.invalid = !this.validity.valid;
    };

    /** Used when validation is pending. */
    #validationComplete = Promise.resolve();

    /** Save a reference to the validation complete resolver */
    #validationCompleteResolver?: (value: void | PromiseLike<void>) => void;

    /** The host element which the validation is based on. */
    #validationHost?: ValidationHost;

    /** Whether validation is pending. */
    #validationPending = false;

    /** Whether the element has been invalidated. */
    @state() invalid = false;

    /** The value of the validation host. */
    @property() value: FormControlValue | null = null;

    /** Validators for this instance of the element. */
    @property({ attribute: false }) validators: Validator[] = [];

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

    validate(): void {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const validators: Validator[] = [...this.validators, ...((this.constructor as any).formControlValidators || [])],
        hasAsyncValidators = validators.some(({ isValid }) => isValid instanceof Promise),
        asyncValidators: Array<Promise<boolean | void>> = [],
        validity: CustomValidityState = {},
        value = this.shouldFormValueUpdate() ? this.value ?? '' : '';

      if (!this.#validationPending) {
        this.#validationComplete = new Promise(resolve => {
          this.#validationCompleteResolver = resolve;
        });
        this.#validationPending = true;
      }

      /**
       * If an abort controller exists from a previous validation step
       * notify still-running async validators that we are requesting they
       * discontinue any work.
       */
      if (this.#abortController) {
        this.#abortController.abort();
        this.#previousAbortController = this.#abortController;
      }

      /**
       * Create a new abort controller and replace the instance reference
       * so we can clean it up for next time
       */
      const abortController = (this.#abortController = new AbortController());

      if (!validators.length) {
        return;
      }

      let keyChanged = false,
        validationMessage: string | undefined = undefined;

      validators.forEach(validator => {
        const key = validator.key || 'customError',
          isValid = validator.isValid(this, value, abortController.signal),
          isAsyncValidator = isValid instanceof Promise;

        if (isAsyncValidator) {
          asyncValidators.push(isValid);

          isValid.then(valid => {
            if (valid === undefined || valid === null) {
              return;
            }

            // Invert the validity state to correspond to the ValidityState API
            validity[key] = !valid;

            validationMessage = this.#getValidatorMessageForValue(validator, value);
            this.#setValidityWithOptionalTarget(validity, validationMessage);
          });
        } else {
          // Invert the validity state to correspond to the ValidityState API
          validity[key] = !isValid;

          if (this.validity[key] !== !isValid) {
            keyChanged = true;
          }

          if (!isValid) {
            validationMessage = this.#getValidatorMessageForValue(validator, value);
          }
        }
      });

      // Once all the async validators have settled, resolve validationComplete
      Promise.allSettled(asyncValidators).then(() => {
        // Don't resolve validations if the signal is aborted
        if (!abortController?.signal.aborted) {
          this.#validationPending = false;
          this.#validationCompleteResolver?.();
        }
      });

      /**
       * If async validators are present:
       * Only run updates when a sync validator has a change. This is to prevent
       * situations where running sync validators can override async validators
       * that are still in progress
       *
       * If async validators are not present, always update validity
       */
      if (keyChanged || !hasAsyncValidators) {
        this.#setValidityWithOptionalTarget(validity, validationMessage);
      }
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

    /** Process the validator message attribute */
    #getValidatorMessageForValue(validator: Validator, value: FormControlValue): string {
      if (validator.message instanceof Function) {
        return validator.message(this, value);
      } else {
        return validator.message;
      }
    }

    /**
     * If the validationHost is not set, the user can decide how they would
     * prefer to handle focus when the field is validated.
     */
    #setValidityWithOptionalTarget(validity: Partial<ValidityState>, validationMessage: string | undefined): void {
      console.log({ validity, validationMessage });

      if (isNativeValidationHost(this.validationHost)) {
        this.validationHost.setCustomValidity(validationMessage ?? '');
      } else {
        this.validationHost.internals.setValidity(validity, validationMessage);
      }
    }
  }

  return Validation;
}
