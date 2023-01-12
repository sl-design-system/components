/* eslint-disable @typescript-eslint/no-floating-promises */
import type { IElementInternals } from 'element-internals-polyfill';
import type { CSSResultGroup, PropertyValues, ReactiveElement, TemplateResult } from 'lit';
import type { Constructor } from '../mixin-types.js';
import type { Validator } from './validators.js';
import { localized, msg, str } from '@lit/localize';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { EventsController } from '../controllers/events.js';
import { dasherize } from '../string.js';
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

      console.log('this.validationMessage', this.validationMessage, this.invalid, state);
      if (!this.invalid || !state) {
        return;
      }

      const validationMessage =
        state === 'customError' ? this.validationMessage : this.#getValidationMessageForState(state);

      return html`<slot .name=${dasherize(state)} part="error">${validationMessage}</slot>`;
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
      const validators: Validator[] = [...((this.constructor as any).formControlValidators || []), ...this.validators],
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

    #getInvalidState(validity: ValidityState): keyof ValidityState | undefined {
      if (validity.badInput) {
        return 'badInput';
      } else if (validity.customError) {
        return 'customError';
      } else if (validity.patternMismatch) {
        return 'patternMismatch';
      } else if (validity.rangeOverflow) {
        return 'rangeOverflow';
      } else if (validity.rangeUnderflow) {
        return 'rangeUnderflow';
      } else if (validity.stepMismatch) {
        return 'stepMismatch';
      } else if (validity.tooLong) {
        return 'tooLong';
      } else if (validity.tooShort) {
        return 'tooShort';
      } else if (validity.typeMismatch) {
        return 'typeMismatch';
      } else if (validity.valueMissing) {
        return 'valueMissing';
      }
    }

    #getValidationMessageForState(state: keyof ValidityState): string | undefined {
      switch (state) {
        case 'badInput':
          return msg('Bad input');
        case 'customError':
          return this.validationMessage;
        case 'patternMismatch':
          return msg('Please match the specified pattern.');
        case 'rangeOverflow':
          return msg('The value is outside the minimum or maximum allowed range.');
        case 'stepMismatch':
          return msg('Step mismatch');
        case 'tooLong':
          if ('maxLength' in this) {
            const length = this.value?.toString().length ?? 0,
              maxLength = this.maxLength ?? 0;

            return msg(
              str`Please use no more than ${maxLength} characters (you are currently using ${length} characters).`
            );
          }
          break;
        case 'tooShort':
          if ('minLength' in this) {
            const count = this.minLength ?? 0;

            return msg(str`This field must be at least ${count} character${count > 1 ? 's' : ''} long.`);
          }
          break;
        case 'typeMismatch':
          return msg('The value does not match the specified type.');
        case 'valueMissing':
          return msg('This field must be filled in.');
      }
    }

    #getValidatorMessageForValue(validator: Validator, value: FormControlValue): string {
      if (validator.message instanceof Function) {
        return validator.message(this, value);
      } else {
        return validator.message;
      }
    }

    #setValidityWithOptionalTarget(validity: Partial<ValidityState>, validationMessage: string | undefined): void {
      if (isNativeValidationHost(this.validationHost)) {
        this.validationHost.setCustomValidity(validationMessage ?? '');
      } else {
        this.validationHost.internals.setValidity(validity, validationMessage);
      }

      const invalid = !this.validity.valid;

      if (invalid !== this.invalid) {
        this.invalid = invalid;
      } else {
        this.requestUpdate();
      }
    }
  }

  return Validation;
}
