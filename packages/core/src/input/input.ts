import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { FormControlMixin } from '@open-wc/form-control';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './input.scss.js';

export class Input extends FormControlMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #onClick = (event: Event): void => {
    event.preventDefault();

    this.input.focus();
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && this.form) {
      this.form.requestSubmit();
    }
  };

  @query('input') private input!: HTMLInputElement;

  /** Placeholder text in the input. */
  @property() placeholder = '';

  /** Whether this input must be filled in before form submission. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** The value of the input. */
  @property() value = '';

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('click', this.#onClick);
    this.addEventListener('invalid', this.#onClick);
    this.addEventListener('keydown', this.#onKeydown);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick);
    this.removeEventListener('invalid', this.#onClick);
    this.removeEventListener('keydown', this.#onKeydown);

    super.disconnectedCallback();
  }

  updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      this.setValue(this.value);
    }
  }

  render(): TemplateResult {
    return html`
      <div class="wrapper" part="wrapper">
        <slot name="prefix"></slot>
        <input
          @input="${this.#onInput}"
          ?required=${this.required}
          .placeholder="${this.placeholder}"
          .value=${this.value}
        />
        <slot name="suffix"></slot>
      </div>
    `;
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.value = target.value;
  }
}
