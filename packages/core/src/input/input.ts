import {CSSResultGroup, html, LitElement, TemplateResult} from 'lit';
import {property, query} from "lit/decorators.js";
import styles from './input.scss.js';

let nextUniqueId = 0;

export class Input extends LitElement {
  /** @private */
  static styles: CSSResultGroup = styles;

  static formAssociated = true;

  @property() placeholder = '';

  @property() id!: string;

  @property() pristine = true;

  @property() validationError?: string;

  @query('input') input!: HTMLInputElement;

  @query('.with-error') errorMessageElement!: HTMLDivElement;

  @property({ type: String }) validationErrorMessage: string = "Hello LitElement";

  #internals: ElementInternals = this.attachInternals();

  #labels: Set<WeakRef<Node>> = new Set<WeakRef<Node>>;

  #validationAttributes = [
    'type',
    'value',
    'placeholder',
    'required',
    'min',
    'max',
    'minLength',
    'maxLength',
    'pattern'
  ];

  get validity(): ValidityState {
    return this.#internals.validity;
  }

  get validationMessage(): string {
    return this.#internals.validationMessage;
  }

  get willValidate(): boolean {
    return this.#internals.willValidate;
  }

  checkValidity(): boolean {
    return this.#internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.#internals.reportValidity();
  }

  get value(): string {
    return this.input.value;
  }

  set value(value: string) {
    this.input.value = value;
    this.#internals.setFormValue(value);
  }

  get form(): HTMLFormElement | null {
    return this.#internals.form;
  }

  get validateOnChange(): boolean {
    return this.hasAttribute('validate-on-change');
  }

  get customErrorDisplay(): boolean {
    return this.hasAttribute('custom-error-display');
  }

  get invalid(): boolean {
    return this.hasAttribute('invalid');
  }

  set invalid(isInvalid: boolean) {
    isInvalid && this.customErrorDisplay ? this.setAttribute('invalid', '') : this.removeAttribute('invalid');
  }


  firstUpdated(): void {
    this.invalid = false;
    this.pristine = true;

    this.#validationAttributes.forEach((attr) => {
      const attrValue = attr === 'required' ? this.hasAttribute(attr) : this.getAttribute(attr);
      if(attrValue !== null && attrValue !== undefined) {
        this.input.setAttribute(attr, attrValue.toString());
      }
    });

    this.input.addEventListener('change', (event) => {
      if(this.validateOnChange) {
        this.pristine = false;
      }

      const clone = new Event(event.type, event);
      this.dispatchEvent(clone);

      this.validateInput();
    });

    this.addEventListener('invalid', (event) => {
      this.invalid = true;
      this.pristine = false;

      if(this.customErrorDisplay) {
        event.preventDefault();
      }
    });

    this.#internals.labels.forEach(label => {
      (label as HTMLLabelElement).id = `sl-input-label-${nextUniqueId++}`;
      label.addEventListener('click', (event: Event) => this.onClick(event));
      const ref = new WeakRef(label);
      this.#labels.add(ref);
    });

    const label = (this.#internals.labels[0] as HTMLLabelElement);
    this.input.setAttribute('aria-labelledby', label.id);
    this.input.setAttribute('aria-label', label.innerText);
    this.setAttribute('aria-labelledby', label.id);

    this.errorMessageElement.id = `sl-input-error-msg-${nextUniqueId++}`;
    this.input.setAttribute('aria-describedby', this.errorMessageElement.id);

    this.validateInput();
  }

  onClick(event: Event): void {
    this.input.focus();
    event.preventDefault();
  }

  onBlur(): void {
    this.validationErrorMessage = this.#internals.validationMessage;
  };

  validateInput(): void {
    const validState = this.input.validity;
    this.invalid = false;

    if (!validState.valid) {
      for (let state in validState) {
        const attr = `content-${state.toString()}`;

        if(validState[state as keyof ValidityState]) {
          this.validationError = state.toString();
          this.invalid = !this.pristine && !validState.valid;

          const errorMessage = this.hasAttribute(attr) ? this.getAttribute(attr) : this.input.validationMessage;

          this.#internals.setValidity(
            {[this.validationError]: true},
            errorMessage?.toString()
          );

          if(this.invalid && this.customErrorDisplay) {
            this.dispatchEvent(new Event('invalid'));
          }
        }
      }
    }
    else {
      this.#internals.setValidity({});
    }
  }

  render(): TemplateResult {
    return html`<input
      @blur="${this.validateOnChange ? this.onBlur : null}"
      .id="${this.id}"
      aria-labelledby="${(this.#internals.labels[0] as HTMLLabelElement)?.id}"
      .placeholder="${this.placeholder}"/>
    <div class="with-error">${this.validateOnChange ? this.validationErrorMessage : this.validationMessage}</div>
    `;
  }

  disconnectedCallback(): void {
    this.#labels.forEach(label => {
      label.deref()?.removeEventListener('click', (event: Event) => this.onClick(event));
    });
  }
}
