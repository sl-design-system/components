import { type LitElement, type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type Form } from './form.js';

export interface FormControllerOptions {
  selector: string;
}

export class FormController implements ReactiveController {
  #form?: Form;
  #host: ReactiveControllerHost & LitElement;
  #selector: string;

  #onUpdate = () => {
    console.log('onUpdate');
  };

  get element() {
    return this.#form;
  }

  get invalid() {
    return this.#form?.invalid;
  }

  get showValidity() {
    return this.#form?.showValidity;
  }

  get valid() {
    return this.#form?.valid;
  }

  get value() {
    return this.#form?.value;
  }

  constructor(host: ReactiveControllerHost & LitElement, options: Partial<FormControllerOptions> = {}) {
    this.#host = host;
    this.#host.addController(this);
    console.log('HOHOHO');

    this.#selector = options.selector ?? 'sl-form';
  }

  /** @internal */
  hostConnected(): void {
    console.log('hostConnected');
  }

  /** @internal */
  hostUpdated(): void {
    console.log('hostUpdated');

    this.#form ??= this.#host.renderRoot.querySelector(this.#selector) as Form;
    if (!this.#form) {
      throw new Error(`A form controller requires a <${this.#selector}> element.`);
    }

    this.#form.addEventListener('sl-update-state', this.#onUpdate);
    this.#form.addEventListener('sl-update-validity', this.#onUpdate);

    console.log(this.#form);
  }

  /** @internal */
  hostDisconnected(): void {
    this.#form?.removeEventListener('sl-update-validity', this.#onUpdate);
    this.#form?.removeEventListener('sl-update-state', this.#onUpdate);
    this.#form = undefined;
  }

  reportValidity(): boolean {
    return this.#form?.reportValidity() ?? false;
  }
}
