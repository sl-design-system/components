export class FormController extends EventTarget {
  #disconnected = true;
  #form;
  #host;
  #selector;
  #onUpdate = () => {
    this.#host.requestUpdate();
    this.#emitUpdateEvent();
  };
  get controls() {
    return (
      this.#form?.controls.reduce((acc, c) => {
        acc[c.name] = c;
        return acc;
      }, {}) ?? {}
    );
  }
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
  set value(value) {
    if (this.#form) {
      this.#form.value = value;
    } else {
      throw new Error('Cannot set value before the form is initialized.');
    }
  }
  constructor(host, options = {}) {
    super();
    this.#host = host;
    this.#host.addController(this);
    this.#selector = options.selector ?? 'sl-form';
  }
  /** @internal */
  hostConnected() {
    this.#disconnected = false;
  }
  /** @internal */
  hostUpdated() {
    this.#form ??= this.#host.renderRoot.querySelector(this.#selector);
    if (!this.#form) {
      throw new Error(`A form controller requires a <${this.#selector}> element.`);
    }
    this.#form.addEventListener('sl-update-state', this.#onUpdate);
    this.#form.addEventListener('sl-update-validity', this.#onUpdate);
    this.#emitUpdateEvent();
  }
  /** @internal */
  hostDisconnected() {
    this.#disconnected = true;
    this.#form?.removeEventListener('sl-update-validity', this.#onUpdate);
    this.#form?.removeEventListener('sl-update-state', this.#onUpdate);
    this.#form = void 0;
  }
  reportValidity() {
    return this.#form?.reportValidity() ?? false;
  }
  reset() {
    this.#form?.reset();
  }
  /**
   * Notify the `FormValidationErrors` component that the form state has changed. Emit the event in
   * the next frame, so the form controls have to time to update.
   */
  #emitUpdateEvent() {
    requestAnimationFrame(() => {
      if (!this.#disconnected) {
        this.dispatchEvent(new Event('sl-update'));
      }
    });
  }
}
//# sourceMappingURL=form-controller.js.map
