/* eslint-disable @typescript-eslint/no-floating-promises */
import type { CSSResultGroup, ReactiveController, ReactiveControllerHost, TemplateResult } from 'lit';
import type { ValidationValue, Validator } from '../validators.js';
import { msg, str } from '@lit/localize';
import { css, html } from 'lit';
import { dasherize } from '../string.js';

export type CustomValidityState = Partial<Record<keyof ValidityState, boolean>>;

export interface NativeValidationTarget extends HTMLElement {
  readonly form: HTMLFormElement | null;

  validationMessage: string;
  validity: ValidityState;

  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}

export interface CustomValidationTarget extends HTMLElement {
  internals: ElementInternals;
}

export type ValidationTarget = NativeValidationTarget | CustomValidationTarget;

export type ValidationConfig = {
  target?: ValidationTarget;
  validators: Validator[];
};

const isNativeValidationTarget = (target: ValidationTarget): target is NativeValidationTarget =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

export const validationStyles: CSSResultGroup = css`
  slot[part='error'] {
    color: #c00;
  }
`;

export class ValidationController implements ReactiveController {
  /** An internal abort controller for cancelling pending async validation. */
  #abortController?: AbortController;
  #previousAbortController?: AbortController;

  /** Custom validators set at runtime. */
  #customValidators?: Validator[];

  /** Controller host. */
  #host: ReactiveControllerHost & HTMLElement;

  /** Whether the target is invalid. */
  #invalid = false;

  /**
   * The element which is being validated. Either a Form Associated
   * Custom Element, or an `<input>` or `<textarea>`.
   */
  #target: ValidationTarget;

  /** Used when validation is pending. */
  #validationComplete = Promise.resolve();

  /** Save a reference to the validation complete resolver */
  #validationCompleteResolver?: (value: void | PromiseLike<void>) => void;

  /** Whether validation is pending. */
  #validationPending = false;

  /**
   * The custom validators. If the target is an `<input>` or `<textarea>`,
   * the target has built-in validators.
   */
  #validators: Validator[] = [];

  #onInvalid = (event: Event): void => {
    event.preventDefault();

    console.log('invalid', event.target);
  };

  #onReset = (event: Event): void => {
    console.log('reset', event.target);
  };

  get validationMessage(): string {
    if (isNativeValidationTarget(this.#target)) {
      return this.#target.validationMessage;
    } else {
      return this.#target.internals.validationMessage;
    }
  }

  get validity(): ValidityState {
    if (isNativeValidationTarget(this.#target)) {
      return this.#target.validity;
    } else {
      return this.#target.internals.validity;
    }
  }

  constructor(host: ReactiveControllerHost & HTMLElement, { target, validators = [] }: ValidationConfig) {
    host.addController(this);

    this.#host = host;
    this.#target = target || (host as unknown as ValidationTarget);
    this.#validators = validators;
  }

  hostConnected(): void {
    document.addEventListener('reset', this.#onReset);
    this.#host.addEventListener('invalid', this.#onInvalid);
  }

  hostDisconnected(): void {
    this.#host.removeEventListener('invalid', this.#onInvalid);
    document.removeEventListener('reset', this.#onReset);
  }

  hostUpdated(): void {
    if ('validators' in this.#host) {
      this.#customValidators = this.#host.validators as Validator[];
    }
  }

  render(): TemplateResult | undefined {
    const state = this.#getInvalidState(this.validity);

    if (!state || !this.#invalid) {
      return;
    }

    return html`<slot .name=${dasherize(state)} part="error">${this.validationMessage}</slot>`;
  }

  addValidator(validator: Validator): void {
    this.#validators = [...this.#validators, validator];
  }

  removeValidator(validator: Validator): void {
    this.#validators = this.#validators.filter(v => v !== validator);
  }

  checkValidity(): boolean {
    if (isNativeValidationTarget(this.#target)) {
      return this.#target.checkValidity();
    } else {
      return this.#target.internals.checkValidity();
    }
  }

  reportValidity(): boolean {
    if (isNativeValidationTarget(this.#target)) {
      return this.#target.reportValidity();
    } else {
      return this.#target.internals.reportValidity();
    }
  }

  setCustomValidity(message: string): void {
    if (isNativeValidationTarget(this.#target)) {
      this.#target.setCustomValidity(message);
    } else {
      this.#target.internals.setValidity({ customError: true }, message);
    }
  }

  validate(value?: ValidationValue): void {
    console.log('validation controller', { value });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const validators: Validator[] = [...this.#validators, ...(this.#customValidators || [])],
      hasAsyncValidators = validators.some(({ isValid }) => isValid instanceof Promise),
      asyncValidators: Array<Promise<boolean | void>> = [],
      validity: CustomValidityState = {};

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
        isValid = validator.isValid(this.#target, value, abortController.signal),
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
          const length = /*this.value?.toString().length ??*/ 0,
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

  #getValidatorMessageForValue(validator: Validator, value: ValidationValue): string {
    if (validator.message instanceof Function) {
      return validator.message(this, value);
    } else {
      return validator.message;
    }
  }

  #setValidityWithOptionalTarget(validity: Partial<ValidityState>, validationMessage: string | undefined): void {
    if (isNativeValidationTarget(this.#target)) {
      this.#target.setCustomValidity(validationMessage ?? '');
    } else {
      this.#target.internals.setValidity(validity, validationMessage);
    }

    const invalid = !this.validity.valid;

    if (invalid !== this.#invalid) {
      this.#invalid = invalid;
    } else {
      this.#host.requestUpdate();
    }
  }
}
