import { type LitElement, type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type Form } from './form.js';

export interface FormControllerOptions {
  selector: string;
}

export class FormController implements ReactiveController {
  #form?: Form;
  #host: ReactiveControllerHost & LitElement;
  #selector: string;

  get element() {
    return this.#form;
  }

  get value() {
    return this.#form?.value;
  }

  constructor(host: ReactiveControllerHost & LitElement, options: Partial<FormControllerOptions> = {}) {
    this.#host = host;
    this.#host.addController(this);
    this.#selector = options.selector ?? 'sl-form';
  }

  hostConnected(): void {}

  hostUpdated(): void {
    this.#form ??= this.#host.renderRoot.querySelector(this.#selector) as Form;
    if (!this.#form) {
      throw new Error(`A form controller requires a <${this.#selector}> element.`);
    }

    console.log(this.#form);
  }

  hostDisconnected(): void {}
}
