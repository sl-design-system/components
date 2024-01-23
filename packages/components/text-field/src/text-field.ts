import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import type { EventEmitter } from '@sl-design-system/shared';
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './text-field.scss.js';

export type TextFieldSize = 'md' | 'lg';

let nextUniqueId = 0;

/**
 * Single line text field component.
 *
 * @csspart wrapper - The input's wrapper
 * @slot prefix - Content shown before the input
 * @slot input - The slot for the input element
 * @slot suffix - Content shown after the input
 */
@localized()
export class TextField extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** @private Hides the external validity icon. */
  override showExternalValidityIcon = false;

  /** Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<void>;

  /** Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<string>;

  /** Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<void>;

  /** The input element in the light DOM. */
  input!: HTMLInputElement;

  /**
   * Specifies which type of data the browser can use to pre-fill the input.
   *
   * NOTE: Declare the type this way so it is backwards compatible with 4.9.5,
   * which we still use in `@sl-design-system/angular`.
   */
  @property() autocomplete?: typeof HTMLInputElement.prototype.autocomplete;

  /** Whether the text field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** This will validate the value of the input using the given pattern. */
  @property() pattern?: string;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether you can interact with the input or if it is just a static, readonly display. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Whether the text field is a required field. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /** The size of the input. */
  @property({ reflect: true }) size: TextFieldSize = 'md';

  /**
   * The input type. Only text types are valid here. For other types,
   * see their respective components.
   */
  @property() type: 'email' | 'number' | 'tel' | 'text' | 'url' | 'password' = 'text';

  /** The value for the input, to be used in forms. */
  @property() override value = '';

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.slot = 'input';
      this.#syncInput(this.input);

      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }

    this.setFormControlElement(this.input);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    const props: Array<keyof TextField> = [
      'autocomplete',
      'disabled',
      'maxLength',
      'minLength',
      'pattern',
      'placeholder',
      'readonly',
      'required',
      'type'
    ];

    if (props.some(prop => changes.has(prop))) {
      this.#syncInput(this.input);
    }

    if (changes.has('value') && this.value !== this.input.value) {
      this.input.value = this.value?.toString() || '';
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="prefix"></slot>
      <slot @keydown=${this.#onKeydown} @input=${this.#onInput} @slotchange=${this.#onSlotchange} name="input"></slot>
      <slot name="suffix">
        ${this.showValidity === 'invalid'
          ? html`<sl-icon .size=${this.size} class="invalid-icon" name="triangle-exclamation-solid"></sl-icon>`
          : nothing}
        ${this.showValidity === 'valid'
          ? html`<sl-icon .size=${this.size} class="valid-icon" name="circle-check-solid"></sl-icon>`
          : nothing}
      </slot>
    `;
  }

  override getLocalizedValidationMessage(): string {
    if (this.validity.tooShort) {
      const length = this.value.length;

      return msg(
        str`Please enter at least ${this.minLength} characters (you currently have ${length} character${
          length > 1 ? 's' : ''
        }).`
      );
    }

    return super.getLocalizedValidationMessage();
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.value = target.value;
    this.changeEvent.emit(this.value);
    this.updateValidity();
  }

  #onKeydown(event: KeyboardEvent): void {
    // Simulate native behavior where pressing Enter in a text field will submit the form
    if (!this.disabled && event.key === 'Enter') {
      this.form?.requestSubmit(this.input);
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      input = elements.find((el): el is HTMLInputElement => el instanceof HTMLInputElement);

    // Handle the scenario where a custom input is being slotted after `connectedCallback`
    if (input) {
      this.input = input;
      this.input.addEventListener('blur', () => this.blurEvent.emit());
      this.input.addEventListener('focus', () => this.focusEvent.emit());
      this.#syncInput(this.input);

      this.setFormControlElement(this.input);
    }
  }

  #syncInput(input: HTMLInputElement): void {
    input.autocomplete = this.autocomplete || 'off';
    input.autofocus = this.autofocus;
    input.disabled = !!this.disabled;
    input.id ||= `sl-text-field-${nextUniqueId++}`;
    input.placeholder = this.placeholder ?? '';
    input.readOnly = !!this.readonly;
    input.required = !!this.required;

    // Do not overwrite the type on slotted inputs
    if (input.type !== this.type && input.type === 'text') {
      input.type = this.type;
    }

    if (typeof this.maxLength === 'number') {
      input.setAttribute('maxlength', this.maxLength.toString());
    } else {
      input.removeAttribute('maxlength');
    }

    if (typeof this.minLength === 'number') {
      input.setAttribute('minlength', this.minLength.toString());
    } else {
      input.removeAttribute('minlength');
    }

    if (typeof this.pattern === 'string') {
      input.setAttribute('pattern', this.pattern);
    } else {
      input.removeAttribute('pattern');
    }
  }
}
