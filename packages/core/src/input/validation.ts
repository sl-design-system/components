import type { LitElement, ReactiveController, ReactiveControllerHost, TemplateResult } from 'lit';
import type { IElementInternals } from 'element-internals-polyfill';
import type { FormControlInterface } from '../utils/form-control/index.js';
import { msg, str } from '@lit/localize';
import { html } from 'lit';
import { dasherize } from '../utils/index.js';

export interface ValidationControllerHost extends ReactiveControllerHost, HTMLElement {
  internals: ElementInternals & IElementInternals;
  minLength?: number;
}

export class ValidationController implements ReactiveController {
  /** The actual element which is associated with a parent form. */
  #control: (LitElement & FormControlInterface) | HTMLInputElement | HTMLTextAreaElement;

  /** The host component, which must use `ElementInternals` to set state. */
  #host: ValidationControllerHost;

  /** Invalid flag. */
  #invalid = false;

  #onInvalid = (event: Event): void => {
    // Prevent the browser from showing the built-in validation UI
    event.preventDefault();

    this.setInvalid(!this.#control.validity.valid);
  };

  #onReset = (event: Event): void => {
    if (this.#control.form === event.target) {
      this.setInvalid(false);
    }
  };

  get invalid(): boolean {
    return this.#invalid;
  }

  constructor(
    host: ValidationControllerHost,
    control: (LitElement & FormControlInterface) | HTMLInputElement | HTMLTextAreaElement
  ) {
    (this.#host = host).addController(this);
    this.#control = control;
  }

  hostConnected(): void {
    document.addEventListener('reset', this.#onReset);
    this.#control.addEventListener('invalid', this.#onInvalid);
  }

  hostDisconnected(): void {
    document.removeEventListener('reset', this.#onReset);
    this.#control.removeEventListener('invalid', this.#onInvalid);
  }

  render(): TemplateResult | undefined {
    const state = this.#getInvalidState(this.#control.validity);

    if (!state || !this.#invalid) {
      return;
    }

    let validationMessage = '';
    switch (state) {
      case 'tooShort':
        if (this.#host.minLength) {
          const count = this.#host.minLength;

          validationMessage = msg(str`This field must be at least ${count} character${count > 1 ? 's' : ''} long.`);
        }
        break;
      case 'valueMissing':
        validationMessage = msg('This field must be filled in.');
        break;
    }

    return html`<slot .name=${dasherize(state)} part="error">${validationMessage}</slot>`;
  }

  setInvalid(invalid: boolean): void {
    if (invalid) {
      this.#host.internals.states.add('--user-invalid');
    } else {
      this.#host.internals.states.delete('--user-invalid');
    }

    this.#invalid = invalid;
    this.#host.requestUpdate();
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
}
