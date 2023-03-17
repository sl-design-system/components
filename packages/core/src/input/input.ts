import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '../utils/index.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { EventsController, ValidationController, validationStyles } from '../utils/controllers/index.js';
import { FormControlMixin, HintMixin } from '../utils/mixins/index.js';
import styles from './input.scss.js';

export type InputSize = 'md' | 'lg';

let nextUniqueId = 0;

/**
 * Single line text input component.
 *
 * @slot prefix - Content shown before the input
 * @slot input - The slot for the input element
 * @slot suffix - Content shown after the input
 */
export class Input extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

  #events = new EventsController(this, {
    click: this.#onClick
  });

  #onKeydown = ({ key }: KeyboardEvent): void => {
    if (key === 'Enter') {
      this.input.form?.requestSubmit();
    }
  };

  #validation = new ValidationController(this, {
    target: () => this.input
  });

  /** The input element in the light DOM. */
  input!: HTMLInputElement;

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** Specifies which type of data the browser can use to pre-fill the input. */
  @property() autocomplete?: string;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Validation using pattern. */
  @property() pattern?: string;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Input size. */
  @property({ reflect: true }) size: InputSize = 'md';

  /**
   * The input type. Only text types are valid here. For other types,
   * see their respective components.
   */
  @property() type: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url' = 'text';

  /** Custom validators specified by the user. */
  @property({ attribute: false }) validators?: Validator[];

  /** The value for the input. */
  @property() value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.autocomplete ||= this.autocomplete || 'off';
      this.input.id ||= `sl-input-${nextUniqueId++}`;
      this.input.slot = 'input';
      this.input.addEventListener('keydown', this.#onKeydown);

      if (!this.input.parentElement) {
        this.append(this.input);
      }

      this.setFormControlElement(this.input);

      this.#validation.validate(this.value);
    }
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

    if (changes.has('pattern')) {
      if (this.pattern) {
        this.input.setAttribute('pattern', this.pattern);
      } else {
        this.input.removeAttribute('pattern');
      }
    }

    if (changes.has('placeholder')) {
      if (this.placeholder) {
        this.input.setAttribute('placeholder', this.placeholder);
      } else {
        this.input.removeAttribute('placeholder');
      }
    }

    if (changes.has('type')) {
      this.input.type = this.type;
    }

    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value || '';
    }
  }

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} class="wrapper">
        <slot name="prefix"></slot>
        <slot @slotchange=${this.#onSlotchange} name="input"></slot>
        <slot name="suffix"></slot>
      </div>
      ${this.renderHint()} ${this.#validation.render()}
    `;
  }

  #onClick(event: Event): void {
    if (event.target === this.input) {
      event.preventDefault();

      this.input.focus();
    }
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.value = target.value;
    this.#validation.validate(this.value);
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      inputs = elements.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && el !== this.input);

    // Handle the scenario where a custom input is being slotted after `connectedCallback`
    if (inputs.length) {
      this.input.removeEventListener('keydown', this.#onKeydown);

      this.input = inputs.at(0) as HTMLInputElement;
      this.input.autocomplete ||= this.autocomplete || 'off';
      this.input.id ||= `sl-input-${nextUniqueId++}`;
      this.input.addEventListener('keydown', this.#onKeydown);

      this.setFormControlElement(this.input);
    }
  }
}
