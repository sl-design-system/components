import { type LitElement, type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type Form } from './form.js';

export interface FormControllerOptions {
  selector: string;
}

export class FormController<T extends Record<string, unknown> = Record<string, unknown>>
  extends EventTarget
  implements ReactiveController
{
  #form?: Form<T>;
  #host: ReactiveControllerHost & LitElement;
  #selector: string;

  #onUpdate = () => {
    this.#host.requestUpdate();

    // Notify the `FormValidationErrors` component that the form state has changed
    this.dispatchEvent(new Event('sl-update'));
  };

  get dirty() {
    return this.#form?.dirty;
  }

  get element() {
    return this.#form;
  }

  get invalid() {
    return this.#form?.invalid;
  }

  get pristine() {
    return this.#form?.pristine;
  }

  get showValidity() {
    return this.#form?.showValidity;
  }

  get touched() {
    return this.#form?.touched;
  }

  get untouched() {
    return this.#form?.untouched;
  }

  get valid() {
    return this.#form?.valid;
  }

  get value() {
    return this.#form?.value;
  }

  constructor(host: ReactiveControllerHost & LitElement, options: Partial<FormControllerOptions> = {}) {
    super();

    this.#host = host;
    this.#host.addController(this);
    this.#selector = options.selector ?? 'sl-form';
  }

  /** @internal */
  hostUpdated(): void {
    this.#form ??= this.#host.renderRoot.querySelector(this.#selector) as Form<T>;
    if (!this.#form) {
      throw new Error(`A form controller requires a <${this.#selector}> element.`);
    }

    this.#form.addEventListener('sl-update-state', this.#onUpdate);
    this.#form.addEventListener('sl-update-validity', this.#onUpdate);

    this.dispatchEvent(new Event('sl-update'));
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
