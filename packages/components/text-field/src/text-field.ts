import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './text-field.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-text-field': TextField;
  }
}

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
export class TextField<T extends { toString(): string } = string> extends FormControlMixin(
  ScopedElementsMixin(LitElement)
) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The value of the text field. */
  #value: T | undefined = '' as unknown as T;

  /** Specifies which type of data the browser can use to pre-fill the input. */
  @property() autocomplete?: typeof HTMLInputElement.prototype.autocomplete;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | undefined>>;

  /** Whether the text field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** The input element in the light DOM. */
  input!: HTMLInputElement;

  /**
   * The size attribute of the input element.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size
   */
  @property({ type: Number, attribute: 'input-size', reflect: true }) inputSize?: number;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** This will validate the value of the input using the given pattern. */
  @property() pattern?: string;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** The raw (string) value of the input. */
  @state() rawValue = '';

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

  override get value(): T | undefined {
    return this.#value;
  }

  /** The value of the text field. */
  @property()
  override set value(value: T | undefined) {
    this.#value = value;
  }

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
      'inputSize',
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

    if (changes.has('disabled')) {
      // We need to wait for the disabled state to propagate to the input before updating the validity
      setTimeout(() => this.updateValidity());
    }

    if (changes.has('value')) {
      const formattedValue = this.formatValue(this.value);

      if (this.input.value !== formattedValue) {
        this.input.value = this.formatValue(this.value);
      }
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.renderPrefix()}
      <slot @keydown=${this.#onKeydown} @input=${this.#onInput} @slotchange=${this.#onSlotchange} name="input"></slot>
      ${this.renderSuffix()}
    `;
  }

  /** Renders the prefix slot; can be overridden to customize the prefix. */
  renderPrefix(): TemplateResult | typeof nothing {
    return html`<slot name="prefix"></slot>`;
  }

  /** Renders the suffix slot; can be overridden to customize the suffix. */
  renderSuffix(): TemplateResult | typeof nothing {
    return html`
      <slot name="suffix">
        ${this.showValidity === 'valid'
          ? html`<sl-icon .size=${this.size} class="valid-icon" name="circle-check-solid"></sl-icon>`
          : nothing}
      </slot>
    `;
  }

  override getLocalizedValidationMessage(): string {
    if (this.validity.tooShort) {
      const length = this.value?.toString().length || 0;

      return msg(
        str`Please enter at least ${this.minLength} characters (you currently have ${length} character${
          length > 1 ? 's' : ''
        }).`
      );
    }

    return super.getLocalizedValidationMessage();
  }

  /**
   * Method that converts the string value in the input to the specified type T. Override this method
   * if you want to convert the value in a different way.
   */
  parseValue(value: string): T | undefined {
    return value as unknown as T;
  }

  /**
   * Method that formats the value and set's it on the native input element. Override this method
   * if you want to format the value in a different way.
   */
  formatValue(value?: T): string {
    return value?.toString() || '';
  }

  override focus(): void {
    this.input.focus();
  }

  #onBlur(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.rawValue = target.value;

    try {
      // Try to parse the value, but do nothing if it fails
      this.value = this.parseValue(this.rawValue);
      this.changeEvent.emit(this.value);
    } catch {
      /* empty */
    }

    this.updateState({ dirty: true });
    this.updateValidity();
  }

  #onKeydown(event: KeyboardEvent): void {
    // Simulate native behavior where pressing Enter in a text field will submit the form
    if (!this.disabled && event.key === 'Enter') {
      this.form?.requestSubmit();
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      input = elements.find((el): el is HTMLInputElement => el instanceof HTMLInputElement);

    // Handle the scenario where a custom input is being slotted after `connectedCallback`
    if (input) {
      this.input = input;
      this.input.addEventListener('blur', () => this.#onBlur());
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

    if (typeof this.inputSize === 'number') {
      input.setAttribute('size', this.inputSize.toString());
    } else {
      input.removeAttribute('size');
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
