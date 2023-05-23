import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '@sl-design-system/shared';
import {
  EventsController,
  FormControlMixin,
  HintMixin,
  ValidationController,
  hintStyles,
  validationStyles
} from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './text-input.scss.js';

export type InputSize = 'md' | 'lg';

let nextUniqueId = 0;

/**
 * Single line text input component.
 *
 * @slot prefix - Content shown before the input
 * @slot input - The slot for the input element
 * @slot suffix - Content shown after the input
 */
export class TextInput extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static override styles: CSSResultGroup = [validationStyles, hintStyles, styles];

  #onKeydown = (event: Event): void => {
    if ((event as KeyboardEvent).key === 'Enter') {
      this.input.form?.requestSubmit();
    }
  };
  #events = new EventsController(this, {
    click: this.#onClick
  });

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

  /** Minimum value. Only applies to number input type.	*/
  @property({ type: Number, attribute: 'min' }) min?: number;

  /** Maximum value. Only applies to number input type. */
  @property({ type: Number, attribute: 'max' }) max?: number;

  /** Specifies the interval between legal numbers for an input field. Only applies to number input type */
  @property({ type: Number, attribute: 'step' }) step?: number;

  /** Validation using pattern. */
  @property() pattern?: string;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether the input is invalid. */
  @property({ type: Boolean, reflect: true }) invalid?: boolean;

  /** Whether the input is valid. */
  @property({ type: Boolean, reflect: true }) valid?: boolean;

  /** Whether the input should get valid styles when is valid. */
  @property({ type: Boolean, reflect: true }) showValid = false;

  /** Whether you can interact with the input or if it is just a static, readonly display. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Input size. */
  @property({ reflect: true }) size: InputSize = 'md';

  /**
   * The input type. Only text types are valid here. For other types,
   * see their respective components.
   */
  @property() type: 'email' | 'number' | 'tel' | 'text' | 'url' | 'password' = 'text';

  /** Custom validators specified by the user. */
  @property({ attribute: false }) validators?: Validator[];

  /** The value for the input. */
  @property() value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.autocomplete ||= this.autocomplete || 'off';
      this.input.id ||= `sl-text-input-${nextUniqueId++}`;
      this.input.slot = 'input';
      if (this.readonly) {
        this.input.readOnly = this.readonly;
      }

      this.input.addEventListener('keydown', this.#onKeydown);

      if (!this.input.parentElement) {
        this.append(this.input);
      }

      this.setFormControlElement(this.input);

      this.#validation.validate(this.value);
    } else {
      if (this.#validation) {
        this.valid = this.showValid ? this.#validation.validity.valid : false;
      }
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('invalid')) {
      if (this.invalid) {
        this.input.setAttribute('invalid', this.invalid.toString());
      } else {
        this.input.removeAttribute('invalid');
      }
    }

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

    if (changes.has('min')) {
      const min = this.min?.toString();
      if (min) {
        this.input.setAttribute('min', min);
      } else {
        this.input.removeAttribute('min');
      }
    }

    if (changes.has('max')) {
      const max = this.max?.toString();
      if (max) {
        this.input.setAttribute('max', max);
      } else {
        this.input.removeAttribute('max');
      }
    }

    if (changes.has('step')) {
      const step = this.step?.toString();
      if (step) {
        this.input.setAttribute('step', step);
      } else {
        this.input.removeAttribute('step');
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

    if (changes.has('readonly')) {
      if (this.readonly) {
        this.input.readOnly = this.readonly;
      } else {
        this.input.removeAttribute('readonly');
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
        <slot @keydown=${this.#onKeydown} @slotchange=${this.#onSlotchange} name="input"></slot>
        <slot name="suffix">
          <sl-icon class="invalid-icon" name="triangle-exclamation-solid" size=${this.size}></sl-icon>
          ${this.valid
            ? html`<sl-icon class="valid-icon" name="circle-check-solid" size=${this.size}></sl-icon>`
            : null}
        </slot>
      </div>
      ${this.#validation.render() ? this.#validation.render() : this.renderHint()}
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
    this.valid = this.showValid ? this.#validation.validity.valid : false;
    if (this.valid) {
      this.input.setAttribute('aria-live', 'polite');
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      inputs = elements.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && el !== this.input);

    // Handle the scenario where a custom input is being slotted after `connectedCallback`
    if (inputs.length) {
      this.input.removeEventListener('keydown', this.#onKeydown);

      this.input = inputs[0];
      this.input.autocomplete ||= this.autocomplete || 'off';
      this.input.id ||= `sl-text-input-${nextUniqueId++}`;
      if (this.readonly) {
        this.input.readOnly = this.readonly;
      }
      this.input.addEventListener('keydown', this.#onKeydown);

      this.setFormControlElement(this.input);
    }
  }
}
