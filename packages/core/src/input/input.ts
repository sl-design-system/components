import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { EventsController } from '../utils/controllers/index.js';
import { dasherize } from '../utils/index.js';
import styles from './input.scss.js';

let nextUniqueId = 0;

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

  /** Element internals instance. */
  internals = this.attachInternals();

  /** Specifies which type of data the browser can use to pre-fill the input. */
  @property() autocomplete = 'off';

  /** No interaction is possible with this control when disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Hint text or indicator that a hint is slotted. */
  @property() hint?: string;

  /**
   * Whether the form control is invalid.
   * @private
   */
  @state() invalid?: boolean;

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

  constructor() {
    super();

    this.input.id = `sl-input-${nextUniqueId++}`;
    this.input.slot = 'input';
    this.append(this.input);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#events.listen(this, 'click', this.#onClick);
    this.#events.listen(this.input, 'keydown', this.#onKeydown);
    this.#events.listen(this.input, 'invalid', this.#onInvalid);
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

    if (changes.has('hint')) {
      this.#updateHint();
    }

    if (changes.has('invalid')) {
      if (this.invalid) {
        this.internals.states.add('--user-invalid');
      } else {
        this.internals.states.delete('--user-invalid');
      }
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
      if (this.placeholder) {
        this.input.setAttribute('placeholder', this.placeholder);
      } else {
        this.input.removeAttribute('placeholder');
      }
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
      <slot @slotchange=${() => this.#updateHint()} name="hint"></slot>
      ${this.invalid ? html`<div id="validation" class="validation">${this.renderValidationMessage()}</div>` : ''}
    `;
  }

  renderValidationMessage(): TemplateResult | undefined {
    const state = this.#getInvalidState(this.input.validity);

    if (state) {
      return html`<slot .name=${dasherize(state)}>${this.input.validationMessage}</slot>`;
    }
  }

  checkValidity(): boolean {
    return this.input.checkValidity();
  }

  reportValidity(): boolean {
    return this.input.reportValidity();
  }

  #onClick(event: Event): void {
    event.preventDefault();

    this.input?.focus();
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.value = target.value;
  }

  #onInvalid(event: Event): void {
    event.preventDefault();

    this.invalid = !this.input.validity.valid;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.input.form?.requestSubmit();
    }
  }

  #updateHint(): void {
    const hint = this.querySelector('[slot="hint"]');

    if (hint) {
      hint.id ||= `sl-input-hint-${nextUniqueId}`;

      this.input.setAttribute('aria-describedby', hint.id);

      if (this.hint) {
        hint.innerHTML = this.hint;
      }
    } else if (this.hint) {
      const div = document.createElement('div');
      div.innerText = this.hint;
      div.slot = 'hint';
      this.append(div);
    } else {
      this.input.removeAttribute('aria-describedby');
    }
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
