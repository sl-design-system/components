import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { FormControlMixin, maxLengthValidator, minLengthValidator, requiredValidator } from '@open-wc/form-control';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import styles from './input.scss.js';

/**
 * Single line text input component.
 *
 * @csspart wrapper - The wrapper container
 * @slot prefix - Content shown before the input
 * @slot suffix - Content shown after the input
 */
export class Input extends FormControlMixin(LitElement) {
  /** @private */
  static formControlValidators = [maxLengthValidator, minLengthValidator, requiredValidator];

  /** @private */
  static override styles: CSSResultGroup = styles;

  #onClick = (event: Event): void => {
    event.preventDefault();

    this.validationTarget?.focus();
  };

  #onInvalid = (event: Event): void => event.preventDefault();

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
      this.form?.requestSubmit();
    }
  };

  /** Specifies which type of data the browser can use to pre-fill the input. */
  @property() autocomplete = 'off';

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the input. */
  @property() placeholder = '';

  /** Whether this input must be filled in before form submission. */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * The input type. Only text types are valid here. For other types,
   * see their respective components.
   */
  @property() type: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url' = 'text';

  /** The validation message shown when the control is invalid. */
  @property() override validationMessage = '';

  /** The element that will be focused when the validity state is reported. */
  @query('input') override validationTarget?: HTMLInputElement;

  /** The value of the input. */
  @property() value = '';

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('click', this.#onClick);
    this.addEventListener('invalid', this.#onInvalid);
    this.addEventListener('keydown', this.#onKeydown);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick);
    this.removeEventListener('invalid', this.#onInvalid);
    this.removeEventListener('keydown', this.#onKeydown);

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('value')) {
      this.setValue(this.value);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('autocomplete')) {
      if (this.autocomplete) {
        this.validationTarget?.setAttribute('autocomplete', this.autocomplete);
      } else {
        this.validationTarget?.removeAttribute('autocomplete');
      }
    }

    if (changes.has('maxLength')) {
      if (this.maxLength) {
        this.validationTarget?.setAttribute('maxlength', this.maxLength.toString());
      } else {
        this.validationTarget?.removeAttribute('maxlength');
      }
    }

    if (changes.has('minLength')) {
      if (this.minLength) {
        this.validationTarget?.setAttribute('minlength', this.minLength.toString());
      } else {
        this.validationTarget?.removeAttribute('minlength');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper" part="wrapper">
        <slot name="prefix"></slot>
        <input
          aria-describedby="validation"
          @input="${this.#onInput}"
          ?required=${this.required}
          .placeholder="${this.placeholder}"
          .type=${this.type}
          .value=${live(this.value)}
        />
        <slot name="suffix"></slot>
      </div>
      ${this.validationMessage
        ? html`
            <div id="validation" class="validation">
              <slot name="validation-message">${this.validationMessage}</slot>
            </div>
          `
        : ''}
    `;
  }

  override resetFormControl(): void {
    this.value = '';
  }

  override validationMessageCallback(message: string): void {
    if ('ariaDescription' in this.internals) {
      (this.internals as unknown as { ariaDescription: string }).ariaDescription = message;
    }

    this.validationMessage = message;
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.value = target.value;
  }
}
