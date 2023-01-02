import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { EventsController } from '../utils/controllers/index.js';
import styles from './input.scss.js';

/**
 * Single line text input component.
 *
 * @csspart wrapper - The wrapper container
 * @slot prefix - Content shown before the input
 * @slot suffix - Content shown after the input
 */
export class Input extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Event controller. */
  #events = new EventsController(this);

  /** The input element in the light DOM. */
  input = document.createElement('input');

  /** Specifies which type of data the browser can use to pre-fill the input. */
  @property() autocomplete = 'off';

  /** No interaction is possible with this control when disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** The name of the form control. */
  @property() name?: string;

  /** Placeholder text in the input. */
  @property() placeholder = '';

  /** Whether this form control is a required field. */
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /**
   * The input type. Only text types are valid here. For other types,
   * see their respective components.
   */
  @property() type: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url' = 'text';

  /** The value of the input. */
  @property() value = '';

  override connectedCallback(): void {
    super.connectedCallback();

    this.input.slot = 'input';
    this.append(this.input);

    this.#events.listen(this, 'click', this.#onClick);
    this.#events.listen(this, 'keydown', this.#onKeydown);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('autocomplete')) {
      if (this.autocomplete) {
        this.input.setAttribute('autocomplete', this.autocomplete);
      } else {
        this.input.removeAttribute('autocomplete');
      }
    }

    if (changes.has('disabled')) {
      this.input.toggleAttribute('disabled', this.disabled);
    }

    if (changes.has('maxLength')) {
      if (this.maxLength) {
        this.input.setAttribute('maxlength', this.maxLength.toString());
      } else {
        this.input.removeAttribute('maxlength');
      }
    }

    if (changes.has('minLength')) {
      if (this.minLength) {
        this.input.setAttribute('minlength', this.minLength.toString());
      } else {
        this.input.removeAttribute('minlength');
      }
    }

    if (changes.has('name')) {
      this.input.name = this.name ?? '';
    }

    if (changes.has('placeholder')) {
      this.input.placeholder = this.placeholder ?? '';
    }

    if (changes.has('required')) {
      this.input.toggleAttribute('required', this.required);
    }

    if (changes.has('type')) {
      this.input.type = this.type;
    }

    if (changes.has('value')) {
      this.input.value = this.value ?? '';
    }
  }

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} class="wrapper" part="wrapper">
        <slot name="prefix"></slot>
        <slot name="input"></slot>
        <slot name="suffix"></slot>
      </div>
      ${this.input.matches(':invalid')
        ? html`
            <div id="validation" class="validation">
              <slot name="validation-message">HOHOHOHO</slot>
            </div>
          `
        : ''}
    `;
  }

  #onClick(event: Event): void {
    event.preventDefault();

    this.input?.focus();
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.value = target.value;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.input.form?.requestSubmit();
    }
  }
}
