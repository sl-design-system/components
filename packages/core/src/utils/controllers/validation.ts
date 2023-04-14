/* eslint-disable @typescript-eslint/no-floating-promises */
import type { CSSResultGroup, ReactiveController, ReactiveControllerHost, TemplateResult } from 'lit';
import type { MessageSize, ValidationValue, Validator } from '../validators.js';
import { msg, str } from '@lit/localize';
import { faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { css, html } from 'lit';
import { dasherize } from '../string.js';
import { Icon } from '../../icon';

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
  target?: ValidationTarget | (() => ValidationTarget);
  validators?: Validator[];
  size?: MessageSize; // TODO: use messagesize of md by default
};

const isNative = (target: ValidationTarget): target is NativeValidationTarget =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

export const validationStyles: CSSResultGroup = css`
  slot[part='error'] {
    color: #c00;
    display: inline-flex;
    align-items: center;
  }
  sl-icon {
    width: 20px;
    height: 20px;
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

  /** Determines when validation messages should be shown. */
  #showErrors = false;

  /** Error message size. */
  #messageSize: MessageSize = 'md';

  /**
   * The element which is being validated. Either a Form Associated
   * Custom Element, or an `<input>` or `<textarea>`.
   */
  #target?: ValidationTarget;

  /** The target is set after the host's connectedCallback has run. */
  #targetFn?: () => ValidationTarget;

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

  // TODO: small, medium, large

  /** Event handler for when invalid validity must be reported. */
  #onInvalid = (event: Event): void => {
    // Prevent the browser from showing the built-in validation UI
    event.preventDefault();

    console.log('onInvalid', this.validity.valid, event);
    // this.#host.setAttribute('invalid', '');
    this.#target?.setAttribute('invalid', '');
    if (isNative(this.target)) {
      this.#host.setAttribute('invalid', '');
      this.#host.requestUpdate();
    } // TODO: not necessary?

    console.log(
      'on invalid this.#showErrors !== !this.validity.valid',
      this.#showErrors !== !this.validity.valid,
      this.#showErrors,
      !this.validity.valid
    );

    if (this.#showErrors !== !this.validity.valid) {
      console.log('host', this.#host);
      this.#target?.setAttribute('invalid', '');
      this.#showErrors = !this.validity.valid;
      if (isNative(this.target)) {
        this.#host.setAttribute('invalid', '');
        this.#host.requestUpdate();
      }
      // this.#host.requestUpdate();
    }
  };

  /** Event handler for when the parent form is reset. */
  #onReset = (event: Event): void => {
    const { form } = isNative(this.target) ? this.target : this.target.internals;

    if (form === event.target) {
      this.#showErrors = false;
      // this.#host.removeAttribute('invalid');
      this.#host.requestUpdate();
    }
  };

  get target(): ValidationTarget {
    if (this.#target) {
      return this.#target;
    } else {
      throw new Error('The validation controller cannot function without a target');
    }
  }

  get validationMessage(): string {
    if (isNative(this.target)) {
      return this.target.validationMessage;
    } else {
      return this.target.internals.validationMessage;
    }
  }

  get validity(): ValidityState {
    if (isNative(this.target)) {
      return this.target.validity;
    } else {
      return this.target.internals.validity;
    }
  }

  constructor(host: ReactiveControllerHost & HTMLElement, { target, validators = [], size }: ValidationConfig) {
    this.#host = host;
    this.#host.addController(this);

    if (size) {
      this.#messageSize = size;
    }

    if (typeof target === 'function') {
      this.#targetFn = target;
    } else {
      this.#target = target || (host as unknown as ValidationTarget);
    }

    this.#validators = validators || [];
  }

  async hostConnected(): Promise<void> {
    // Wait until the host has called connectedCallback
    await this.#host.updateComplete;

    if (!this.#target && this.#targetFn) {
      this.#target = this.#targetFn();
    }

    // If the element has no title attribute, then add one, otherwise
    // the native `validationMessage` will be shown in a native tooltip.
    if (isNative(this.target) && !this.target.hasAttribute('title')) {
      this.target.setAttribute('title', '');
    }

    console.log('target', this.target);

    document.addEventListener('reset', this.#onReset);
    this.target.addEventListener('invalid', this.#onInvalid);
  }

  hostDisconnected(): void {
    this.target.removeEventListener('invalid', this.#onInvalid);
    document.removeEventListener('reset', this.#onReset);
  }

  hostUpdated(): void {
    console.log('host updated in validation', this.#host);
    if ('validators' in this.#host) {
      this.#customValidators = this.#host.validators as Validator[];
    }
  }

  render(): TemplateResult | undefined {
    if (!this.#target) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    Icon.registerIcon(faTriangleExclamation);

    console.log('isNative(this.target), this.target', isNative(this.target), this.target);

    const state = this.#getInvalidState(this.validity);
    console.log('state', state, !!state, this.#host, this.#target, this.validity.valid);
    console.log('state showErrors', this.#showErrors);
    // if (!this.validity.valid) {
    //   this.#target.setAttribute('invalid', '');
    //   this.#host.setAttribute('invalid', '');
    // } else {
    //   this.#target.removeAttribute('invalid');
    //   this.#host.removeAttribute('invalid');
    // } // TODO: not working properly with checkbox

    if (this.#showErrors && state) {
      this.#target.setAttribute('invalid', ''); // TODO: it breaks initially added invalid
      if (isNative(this.target)) {
        this.#host.setAttribute('invalid', ''); // TODO: it breaks initially added invalid
        this.#host.requestUpdate();
      }
      // TODO: add sl-icon
      return html`<slot
        .name=${dasherize(state)}
        part="error"
        @slotchange=${this.#handleSlotchange}
        size="${this.#messageSize}"
      >
        ${this.#messageSize}
        <svg class="invalid-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
          <path
            fill="#E5454A"
            d="M17.3242 15.0918 11.084 4.4278c-.4981-.8204-1.6992-.8204-2.168 0l-6.2695 10.664c-.4688.8203.1172 1.8457 1.084 1.8457h12.5097c.9668 0 1.5528-1.0254 1.084-1.8457Zm-8.0273-7.295c0-.3808.293-.703.7031-.703.3809 0 .7031.3222.7031.703v3.7501c0 .4101-.3222.7031-.7031.7031-.3516 0-.7031-.293-.7031-.7031v-3.75ZM10 15.0626c-.5273 0-.9375-.4102-.9375-.9082 0-.4981.4102-.9082.9375-.9082.498 0 .9082.4101.9082.9082 0 .498-.4102.9082-.9082.9082Z"
          />
        </svg>
        ${!isNative(this.target) ? html`<sl-icon name="fas-triangle-exclamation"></sl-icon>` : null}
        ${this.validationMessage}
      </slot>`;
    } else {
      this.#target.removeAttribute('invalid');
      if (isNative(this.target)) {
        this.#host.removeAttribute('invalid');
        this.#host.requestUpdate();
      }
      //this.#host.requestUpdate();
    }

    //.size=${this.#messageSize} not working
  }

  #handleSlotchange(event: Event & { target: HTMLSlotElement }): void {
    // const childNodes = e.target.assignedNodes({flatten: true});
    // // ... do something with childNodes ...
    // this.allText = childNodes.map((node) => {
    //   return node.textContent ? node.textContent : ''
    // }).join('');

    const elements = event.target.assignedElements({ flatten: true });
    console.log('elements in validation', elements);
  }

  addValidator(validator: Validator): void {
    this.#validators = [...this.#validators, validator];
  }

  removeValidator(validator: Validator): void {
    this.#validators = this.#validators.filter(v => v !== validator);
  }

  setCustomValidity(message: string): void {
    if (isNative(this.target)) {
      this.target.setCustomValidity(message);
    } else {
      this.target.internals.setValidity({ customError: true }, message);
    }
  }

  validate(value?: ValidationValue): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const validators: Validator[] = [...this.#validators, ...(this.#customValidators || [])],
      hasAsyncValidators = validators.some(({ isValid }) => isValid instanceof Promise),
      asyncValidators: Array<Promise<boolean | void>> = [],
      validity: CustomValidityState = {};

    // TODO: maybe add here invalid/valid attribute validity.valid?

    console.log('this.validity.valid in validate', this.validity.valid);

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
        isValid = validator.isValid(this.target, value, abortController.signal),
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
    if (isNative(this.target)) {
      this.target.setCustomValidity(validationMessage ?? '');
    } else {
      this.target.internals.setValidity(validity, validationMessage);
    }

    this.#host.requestUpdate();
  }
}
