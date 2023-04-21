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
  size?: MessageSize; // TODO: use messagesize of md by default
};

const isNative = (target: ValidationTarget): target is NativeValidationTarget =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

let nextUniqueId = 0;

export const validationStyles: CSSResultGroup = css`
  slot[part='error'] {
    color: #c73434;
    display: inline-flex;
    align-items: center;
    fill: var(--sl-color-text-field-invalid-focus-icon);
    --_size: 20px;
  }
  slot[part='error'][error-size='sm'] {
    font: var(--sl-text-input-helper-sm);
    padding-top: var(--sl-space-helper-padding-top-sm);
    // gap: var(--sl-space-helper-gap-sm);
  }
  slot[part='error'][error-size='md'] {
    font: var(--sl-text-input-helper-md);
    padding-top: var(--sl-space-helper-padding-top-md);
    // gap: var(--sl-space-helper-gap-md);
  }
  slot[part='error'][error-size='lg'] {
    font: var(--sl-text-input-helper-lg);
    padding-top: var(--sl-space-helper-padding-top-lg);
    // gap: var(--sl-space-helper-gap-lg);
    // display: inline-flex;
  }
  slot[part='error']::slotted(sl-icon) {
    width: 20px;
    height: 20px;
    fill: var(--sl-color-text-field-invalid-focus-icon);
    --_icon-size: 20px;
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

  /** Unique ID for error message. */
  #errorMessageId = `sl-error-${nextUniqueId++}`;

  /** Name of slotted validation message. */
  #slotName: string;

  /** Event handler for when invalid validity must be reported. */
  #onInvalid = (event: Event): void => {
    // Prevent the browser from showing the built-in validation UI
    event.preventDefault();

    // this.#host.setAttribute('invalid', '');
    this.#target?.setAttribute('invalid', '');
    if (isNative(this.target)) {
      this.#host.setAttribute('invalid', '');
      this.target.ariaInvalid = 'true';
      this.#host.requestUpdate();
    } // TODO: not necessary?

    if (this.#showErrors !== !this.validity.valid) {
      const state = this.#getInvalidState(this.validity);
      if (!state) {
        return;
      }
      this.#slotName = dasherize(state);
      this.#target?.setAttribute('aria-describedby', this.#errorMessageId); // TODO: check if it is the right place
      this.#updateValidationMessage();
      this.#target?.setAttribute('invalid', '');
      this.#showErrors = !this.validity.valid;
      // if (isNative(this.target)) {
      //   this.#host.setAttribute('invalid', '');
      //   this.#host.requestUpdate();
      // }
      this.#host.requestUpdate();
    }
  };

  /** Event handler for when the parent form is reset. */
  #onReset = (event: Event): void => {
    const { form } = isNative(this.target) ? this.target : this.target.internals;

    if (form === event.target) {
      this.#showErrors = false;
      this.#host.removeAttribute('invalid');
      this.target.ariaInvalid = null;
      this.#removeValidationMessage();
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

  constructor(host: ReactiveControllerHost & HTMLElement, { target, validators = [] /*, size*/ }: ValidationConfig) {
    this.#host = host;
    this.#host.addController(this);

    // console.log('size in validation constructor', size, this, host);

    // if (size) {
    //   this.#messageSize = size;
    // } else {
    //   this.#messageSize = 'md';
    // }

    if (this.#host.hasAttribute('error-size')) {
      this.#messageSize = this.#host.getAttribute('error-size') as MessageSize;
    } else {
      this.#messageSize = 'md';
    }

    // console.log('size in validation constructor - 2', size, this, host);

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
      this.#target.setAttribute('invalid', ''); // TODO: it breaks initially added invalid
      if (isNative(this.target)) {
        this.#host.setAttribute('invalid', ''); // TODO: it breaks initially added invalid
        this.#host.requestUpdate();
      }

      this.#updateValidationMessage();

      // @slotchange="${this.#updateValidationMessage}"

      return html`<slot .name=${this.#slotName} part="error" error-size="${this.#messageSize}"></slot>`;
      // size="${this.#messageSize}"
    } else if (this.validity.valid) {
      this.#removeValidationMessage();
      // this.#target.removeAttribute('invalid');
      //  if (isNative(this.target)) {
      this.#host.removeAttribute('invalid'); // TODO: causes problems with invalid checkbox
      this.target.ariaInvalid = null;
      this.#host.requestUpdate();
      // }
      //this.#host.requestUpdate();
    }

    /*    ${!isNative(this.target)
  ? html`<sl-icon class="invalid-icon" name="fas-triangle-exclamation"></sl-icon>`
  : null}
    ${this.validationMessage}*/

    // <svg class="invalid-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
    // <path
    //   fill="#E5454A"
    // d="M17.3242 15.0918 11.084 4.4278c-.4981-.8204-1.6992-.8204-2.168 0l-6.2695 10.664c-.4688.8203.1172 1.8457 1.084 1.8457h12.5097c.9668 0 1.5528-1.0254 1.084-1.8457Zm-8.0273-7.295c0-.3808.293-.703.7031-.703.3809 0 .7031.3222.7031.703v3.7501c0 .4101-.3222.7031-.7031.7031-.3516 0-.7031-.293-.7031-.7031v-3.75ZM10 15.0626c-.5273 0-.9375-.4102-.9375-.9082 0-.4981.4102-.9082.9375-.9082.498 0 .9082.4101.9082.9082 0 .498-.4102.9082-.9082.9082Z"
    //   />
    //   </svg>
  }

  #updateValidationMessage(): void {
    //const input = this.querySelector('input, textarea'),
    //const hint = this.#host.querySelector('[part="error"]');
    const error = this.#host.querySelector('[slot]');
    const errorPart = this.#host.querySelector('[part="error"]');

    console.log(
      'hint',
      error,
      errorPart,
      this.target.querySelector('[slot]'),
      this.#host.shadowRoot?.querySelector('[part="error"]'),
      //(hint ? hint.slot : null),
      this.#slotName,
      this.#host.querySelector('[slot]'),
      this.target.querySelector('[slot]'),
      'hint error 1',
      error,
      this.#host.querySelector('[part="error"]'),
      this.target.querySelector('[part="error"]'),
      this.#slotName
    );

    // const customErrorMessage = error && error.slot === this.#slotName;
    // console.log('customErrorMessage', customErrorMessage, error, error?.hasAttribute('part'));

    // this.target.setAttribute('aria-describedby', this.#errorMessageId);

    if (this.target.querySelector('[slot]')) {
      console.log('idzie if');
      console.log('error error', error);
      if (error) {
        error.id = `sl-error-${nextUniqueId++}`;
        // if (!error.hasAttribute('size')) {
        //   error.setAttribute('size', this.#messageSize);
        // }
        if (error.hasAttribute('error-size')) {
          this.#messageSize = error.getAttribute('error-size') as MessageSize;
        }
        this.target.setAttribute('aria-describedby', error.id); // TODO: check if it is the right place
        error.setAttribute('aria-live', 'assertive');
        //this.#host.requestUpdate();
      }
    } else if (this.validationMessage && errorPart?.slot !== this.#slotName && !this.target.querySelector('[slot]')) {
      console.log('idzie else if', this.#messageSize);
      // console.log(
      //   '111hint error   this.target',
      //   this.target,
      //   this.target.hasAttribute('aria-describedby'),
      //   this.#errorMessageId,
      //   'hint?',
      //   errorPart,
      //   this.target.getAttribute('aria-describedby')
      // );
      if (this.target.hasAttribute('aria-describedby')) {
        this.target.removeAttribute('aria-describedby'); // TODO: check if it is the right place and good to remove it here?
      }
      this.target.setAttribute('aria-describedby', this.#errorMessageId);
      //this.#host.requestUpdate();
      // console.log(
      //   'hint error   this.target',
      //   this.target,
      //   this.#host,
      //   this.#errorMessageId,
      //   'hint?',
      //   errorPart,
      //   this.target.getAttribute('aria-describedby')
      // );
      // this.target.setAttribute('aria-describedby', this.#errorMessageId);
      errorPart?.remove();
      const div = document.createElement('sl-error');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      Icon.registerIcon(faTriangleExclamation);
      /*const icon: Icon | null = !isNative(this.target)
        ? '<sl-icon class="invalid-icon" name="fas-triangle-exclamation" style="width: 20px; height: 20px; margin-right: `${var(--sl-space-group-md)}`;}"></sl-icon>'
        : null;*/
      const iconSize = this.#messageSize === 'sm' ? 'md' : 'lg';
      // const icon = '<sl-icon class="invalid-icon" name="fas-triangle-exclamation"></sl-icon>';
      const icon = document.createElement('sl-icon');
      icon.setAttribute('name', 'fas-triangle-exclamation');
      icon.setAttribute('size', iconSize);
      // const icon = (new Icon().name = 'fas-triangle-exclamation') as Icon;
      //div.innerText = this.validationMessage;
      //icon = this.#icon();
      if (icon && !isNative(this.target)) {
        // (icon as unknown as Icon).size = iconSize;
        div.append(icon);
        const validationMessage = document.createTextNode(this.validationMessage);
        div.appendChild(validationMessage);
        console.log('iconn', icon);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/restrict-template-expressions
        // div.innerHTML = `${icon} ${this.validationMessage}`;
        // div.append(icon);
      } else {
        div.innerHTML = this.validationMessage;
      }

      div.id = this.#errorMessageId;
      // div.setAttribute('hintSize', this.hintSize);
      // div.part = 'error';
      div.setAttribute('part', 'error');
      div.style.display = 'inline-flex';
      div.style.alignItems = 'center';
      div.style.setProperty('gap', `var(--sl-space-helper-gap-${this.#messageSize})`); // TODO: space-helper-gap token + add sizes
      div.setAttribute('error-size', this.#messageSize);
      div.slot = this.#slotName;
      //div.appendChild(this.#icon());
      div.setAttribute('aria-live', 'assertive');
      // console.log('inside div adding', this.#host, this.#target, this.target);
      // if (isNative(this.target)) {
      this.#host.append(div);
      //this.#host.requestUpdate();
      // this.#host.requestUpdate();
      // } else {
      //   this.#host.parentNode?.insertBefore(div, this.#host);
      // }
      //this.#icon();
    } /*else {
      this.target.removeAttribute('aria-describedby');
    }*/
  }

  #removeValidationMessage(): void {
    this.#host.querySelector('[part="error"]')?.remove();
    if (this.#target?.hasAttribute('aria-describedby')) {
      // console.log(
      //   "this.#target?.getAttribute('aria-describedby')",
      //   this.#target?.getAttribute('aria-describedby'),
      //   this.#errorMessageId
      // );
      const describedBy = this.#target?.getAttribute('aria-describedby');
      describedBy?.replace(this.#errorMessageId, '').replace('  ', ' ').trim();
      // this.#host.requestUpdate();
      // console.log(
      //   "this.#target?.getAttribute('aria-describedby')",
      //   this.#target?.getAttribute('aria-describedby'),
      //   this.#errorMessageId
      // );
    }
    // this.target.removeAttribute('aria-describedby');
    // this.#host.requestUpdate();
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

    console.log('this.validity.valid in validate', this.validity.valid, this.#host);

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
