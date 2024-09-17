import { type LitElement, type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type Form } from './form.js';

export interface FormControllerOptions {
  selector: string;
}

export class FormController<T extends Record<string, unknown> = Record<string, unknown>>
  extends EventTarget
  implements ReactiveController
{
  #disconnected = true;
  #form?: Form<T>;
  #host: ReactiveControllerHost & LitElement;
  #selector: string;

  #onUpdate = () => {
    this.#host.requestUpdate();
    this.#emitUpdateEvent();
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

  set value(value: T | undefined) {
    if (this.#form) {
      this.#form.value = value;
    } else {
      throw new Error('Cannot set value before the form is initialized.');
    }
  }

  constructor(host: ReactiveControllerHost & LitElement, options: Partial<FormControllerOptions> = {}) {
    super();

    this.#host = host;
    this.#host.addController(this);
    this.#selector = options.selector ?? 'sl-form';
  }

  /** @internal */
  hostConnected(): void {
    this.#disconnected = false;
  }

  /** @internal */
  hostUpdated(): void {
    this.#form ??= this.#host.renderRoot.querySelector(this.#selector) as Form<T>;
    if (!this.#form) {
      throw new Error(`A form controller requires a <${this.#selector}> element.`);
    }

    this.#form.addEventListener('sl-update-state', this.#onUpdate);
    this.#form.addEventListener('sl-update-validity', this.#onUpdate);

    this.#emitUpdateEvent();
  }

  /** @internal */
  hostDisconnected(): void {
    this.#disconnected = true;
    this.#form?.removeEventListener('sl-update-validity', this.#onUpdate);
    this.#form?.removeEventListener('sl-update-state', this.#onUpdate);
    this.#form = undefined;
  }

  reportValidity(): boolean {
    return this.#form?.reportValidity() ?? false;
  }

  reset(): void {
    this.#form?.reset();
  }

  /**
   * Notify the `FormValidationErrors` component that the form state has changed.
   * Emit the event in the next frame, so the form controls have to time to update.
   */
  #emitUpdateEvent(): void {
    requestAnimationFrame(() => {
      if (!this.#disconnected) {
        this.dispatchEvent(new Event('sl-update'));
      }
    });
  }
}
