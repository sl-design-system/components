/* eslint-disable @typescript-eslint/no-floating-promises */
import type { CSSResultGroup, ReactiveController, ReactiveControllerHost, TemplateResult } from 'lit';
import type { MessageSize, ValidationValue, Validator } from '../validators.js';
import { msg, str } from '@lit/localize';
import { faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sanomalearning/slds-core/icon';
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
  target?: ValidationTarget | (() => ValidationTarget);
  validators?: Validator[];
};

const isNative = (target: ValidationTarget): target is NativeValidationTarget =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

let nextUniqueId = 0;

export const validationStyles: CSSResultGroup = css`
  slot[part='error']::slotted(*) {
    color: var(--sl-color-helper-text-invalid);
    display: inline-flex;
    align-items: center;
    fill: var(--sl-color-text-field-invalid-focus-icon);
  }
  slot[part='error'][error-size='sm']::slotted(*) {
    font: var(--sl-text-input-helper-sm);
    padding-top: var(--sl-space-helper-padding-top-sm);
    gap: var(--sl-space-helper-gap-sm);
  }
  slot[part='error'][error-size='md']::slotted(*) {
    font: var(--sl-text-input-helper-md);
    padding-top: var(--sl-space-helper-padding-top-md);
    gap: var(--sl-space-helper-gap-md);
  }
  slot[part='error'][error-size='lg']::slotted(*) {
    font: var(--sl-text-input-helper-lg);
    padding-top: var(--sl-space-helper-padding-top-lg);
    gap: var(--sl-space-helper-gap-lg);
  }
  slot[part='error']::slotted(sl-icon) {
    fill: var(--sl-color-text-field-invalid-focus-icon);
  }
`; // TODO change token for the icon colour

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

  /** Unique ID for error message. */
  #errorMessageId = `sl-error-${nextUniqueId++}`;

  /** Name of slotted validation message. */
  #slotName: string;

  /** Label connected with the element being validated */
  #label?: HTMLElement | null;

  /** Event handler for when invalid validity must be reported. */
  #onInvalid = (event: Event): void => {
    // Prevent the browser from showing the built-in validation UI
    event.preventDefault();

    this.#target?.setAttribute('invalid', '');
    if (isNative(this.target)) {
      this.#host.setAttribute('invalid', '');
      this.target.ariaInvalid = 'true';
      this.#host.requestUpdate();
    }
    this.#label?.setAttribute('invalid', '');

    if (this.#showErrors !== !this.validity.valid) {
      const state = this.#getInvalidState(this.validity);
      if (!state) {
        return;
      }
      this.#slotName = dasherize(state);
      this.#target?.setAttribute('aria-describedby', this.#errorMessageId); // TODO: check if it is the right place
      this.#updateValidationMessage();
      this.#target?.setAttribute('invalid', '');
      this.#label?.setAttribute('invalid', '');
      this.#showErrors = !this.validity.valid;
      this.#host.requestUpdate();
    }
  };

  /** Event handler for when the parent form is reset. */
  #onReset = (event: Event): void => {
    const { form } = isNative(this.target) ? this.target : this.target.internals;

    if (form === event.target) {
      this.#showErrors = false;
      this.#host.removeAttribute('invalid');
      this.#label?.removeAttribute('invalid');
      this.target.ariaInvalid = null;
      this.#removeValidationMessage();
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

  constructor(host: ReactiveControllerHost & HTMLElement, { target, validators = [] /*, size*/ }: ValidationConfig) {
    this.#host = host;
    this.#host.addController(this);

    if (this.#host.hasAttribute('error-size')) {
      this.#messageSize = this.#host.getAttribute('error-size') as MessageSize;
    } else {
      this.#messageSize = 'md';
    }

    if (typeof target === 'function') {
      this.#targetFn = target;
    } else {
      this.#target = target || (host as unknown as ValidationTarget);
    }

    this.#validators = validators || [];
    this.#slotName = '';
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

    if (isNative(this.target)) {
      if (this.#host.id) {
        this.#label = (this.#host?.getRootNode() as Element)?.querySelector<HTMLElement>(`[for=${this.#host.id}]`);
      }
    } else {
      if (this.#target?.id) {
        this.#label = (this.#target?.getRootNode() as Element)?.querySelector<HTMLElement>(`[for=${this.#target.id}]`);
      }
    }

    document.addEventListener('reset', this.#onReset);
    this.target.addEventListener('invalid', this.#onInvalid);
  }

  hostDisconnected(): void {
    this.target.removeEventListener('invalid', this.#onInvalid);
    document.removeEventListener('reset', this.#onReset);
  }

  hostUpdated(): void {
    if ('validators' in this.#host) {
      this.#customValidators = this.#host.validators as Validator[];
    }
  }

  render(): TemplateResult | undefined {
    if (!this.#target || !this.target || !this.#host) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    Icon.registerIcon(faTriangleExclamation);

    const state = this.#getInvalidState(this.validity);

    if (this.#showErrors && state) {
      this.#slotName = dasherize(state);
      this.#target.setAttribute('invalid', '');
      if (isNative(this.target)) {
        this.#host.setAttribute('invalid', ''); // TODO: it breaks initially added invalid
        this.#host.requestUpdate();
      }
      this.#label?.setAttribute('invalid', '');

      this.#updateValidationMessage();

      return html`<slot
        class="error-message"
        .name=${this.#slotName}
        part="error"
        error-size="${this.#messageSize}"
      ></slot>`;
    } else if (this.validity.valid) {
      this.#removeValidationMessage();
      this.#host.removeAttribute('invalid');
      this.#label?.removeAttribute('invalid');
      this.target.ariaInvalid = null;
      this.#host.requestUpdate();
    }
  }

  #updateValidationMessage(): void {
    const errorPart = this.#host.querySelector('[part="error"]'),
      currentError = this.#host.querySelector('sl-error');

    if (
      (!currentError && this.validationMessage) ||
      currentError?.slot !== this.#slotName ||
      this.validationMessage !== (errorPart as HTMLElement)?.innerText
    ) {
      if (currentError) {
        currentError.remove();
      }

      this.target.setAttribute('aria-describedby', this.#errorMessageId);

      const div = document.createElement('sl-error'),
        iconSize = this.#messageSize === 'sm' ? 'md' : 'lg',
        icon = document.createElement('sl-icon');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      Icon.registerIcon(faTriangleExclamation);
      icon.setAttribute('name', 'fas-triangle-exclamation');
      icon.setAttribute('size', iconSize);

      if (icon && !isNative(this.target)) {
        div.append(icon);
        const validationMessage = document.createTextNode(this.validationMessage);
        div.appendChild(validationMessage);
      } else {
        div.innerHTML = this.validationMessage;
      }

      div.id = this.#errorMessageId;
      div.setAttribute('part', 'error');
      div.setAttribute('error-size', this.#messageSize);
      div.slot = this.#slotName;
      div.setAttribute('aria-live', 'assertive');
      this.#host.append(div);
    }
  }

  #removeValidationMessage(): void {
    this.#host.querySelector('[part="error"]')?.remove();
    if (this.#target?.hasAttribute('aria-describedby')) {
      const describedBy = this.#target?.getAttribute('aria-describedby'),
        ids = describedBy?.split(' '),
        index = ids?.indexOf(this.#errorMessageId);

      if (index !== -1 && ids) {
        let newIds: string[] = [];
        if (index) {
          newIds = ids.splice(index, 1);
        }
        const newAriaDescribedby = ids?.join(' ');
        if (newAriaDescribedby) {
          this.#target.setAttribute('aria-describedby', newIds.toString());
        }
      }
    }
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
