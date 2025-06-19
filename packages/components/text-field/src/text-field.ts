import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  ObserveAttributesMixin,
  ObserveAttributesMixinInterface,
  closestElementComposed,
  event
} from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { FieldButton } from './field-button.js';
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
export class TextField
  extends ObserveAttributesMixin(FormControlMixin(ScopedElementsMixin(LitElement)), [
    'aria-disabled',
    'aria-label',
    'aria-labelledby',
    'aria-required'
  ])
  implements ObserveAttributesMixinInterface
{
  /** @internal */
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-disabled', 'aria-label', 'aria-labelledby', 'aria-required'];
  }

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-field-button': FieldButton,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The value of the text field. */
  #value?: string = '';

  /**
   * Specifies which type of data the browser can use to pre-fill the input.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
   */
  @property() autocomplete?: string;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<string | undefined>>;

  /** Whether the text field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal Embedded or slotted field buttons. */
  @state() fieldButtons: FieldButton[] = [];

  /** The formatted value, to be used as the input value. */
  @state()
  get formattedValue(): string {
    return this.value?.toString() || '';
  }

  /** @internal Used for styling the focus ring of the input. */
  @property({ type: Boolean, reflect: true, attribute: 'has-focus-ring' }) hasFocusRing?: boolean;

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

  /**
   * The size of the input.
   * @default md
   */
  @property({ reflect: true }) size?: TextFieldSize;

  /**
   * The input type. Only text types are valid here. For other types,
   * see their respective components.
   */
  @property() type: 'email' | 'number' | 'tel' | 'text' | 'url' | 'password' = 'text';

  override get value(): string | undefined {
    return this.#value;
  }

  /** The value of the text field. */
  @property()
  override set value(value: string | undefined) {
    this.#value = value;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.slot = 'input';

      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }

    this.setFormControlElement(this.input);

    if (this.tagName === 'SL-TEXT-FIELD') {
      // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
      const style = document.createElement('style');
      style.innerHTML = `
        sl-text-field:has(input:hover):not(:focus-within) {
          --_bg-opacity: var(--sl-opacity-light-interactive-plain-hover);
        }
      `;
      this.prepend(style);
    }
  }

  override firstUpdated(changes: PropertyValues): void {
    super.firstUpdated(changes);

    // Set the `fieldButtons` using a microtask so we do not create a lifecycle loop
    requestAnimationFrame(() => {
      const buttons = this.renderRoot.querySelectorAll('sl-field-button');
      if (buttons.length) {
        this.fieldButtons = [...this.fieldButtons, ...buttons];
      }
    });
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
      this.updateInputElement(this.input);
    }

    if (changes.has('disabled')) {
      // We need to wait for the disabled state to propagate to the input before updating the validity
      setTimeout(() => this.updateValidity());
    }

    if (changes.has('disabled') || changes.has('fieldButtons') || changes.has('size')) {
      this.fieldButtons.forEach(button => {
        button.size = this.size;
        button.disabled ??= this.disabled;
      });
    }

    if (changes.has('formattedValue') || changes.has('value')) {
      const formattedValue = this.formattedValue;

      if (this.input.value !== formattedValue) {
        this.input.value = formattedValue;
      }
    }
  }

  override render(): TemplateResult {
    return html`${this.renderPrefix()}${this.renderInputSlot()}${this.renderSuffix()}`;
  }

  /** Renders the prefix slot; can be overridden to customize the prefix. */
  renderPrefix(): TemplateResult | typeof nothing {
    return html`<slot @slotchange=${this.onPrefixSlotChange} name="prefix"></slot>`;
  }

  /** Render the input slot; separate method so it is composable for child components. */
  renderInputSlot(): TemplateResult {
    return html`
      <slot @keydown=${this.onKeydown} @input=${this.onInput} @slotchange=${this.onSlotChange} name="input"></slot>
    `;
  }

  /**
   * Renders the suffix slot; can be overridden to customize the suffix. Remember that if
   * you override this method, it will no longer automatically show the valid checkmark
   * when the input is valid.
   */
  renderSuffix(): TemplateResult | typeof nothing {
    return html`
      <slot @slotchange=${this.onSuffixSlotChange} name="suffix">
        ${this.showValidity === 'valid' ? html`<sl-icon class="valid" name="circle-check-solid"></sl-icon>` : nothing}
      </slot>
    `;
  }

  override getLocalizedValidationMessage(): string {
    if (this.validity.tooShort) {
      const length = this.value?.toString().length || 0;

      return msg(
        str`Please enter at least ${this.minLength} characters (you currently have ${length} character${
          length > 1 ? 's' : ''
        }).`,
        { id: 'sl.common.validation.tooShort' }
      );
    }

    return super.getLocalizedValidationMessage();
  }

  /**
   * Method that parses the string input and converts it to a specific value. Override this method
   * if you want to convert the value in a different way. Throw an error if the value is invalid.
   */
  parseValue(value: string): void {
    this.value = value;
  }

  /** @internal */
  override focus(): void {
    this.input.focus();
  }

  /**
   * Handles the blur event when the input field loses focus.
   * Emits a `sl-blur` event if the component had focus and updates the state.
   */
  protected onBlur(): void {
    // Only emit the event if we have focus
    if (this.hasFocusRing) {
      this.hasFocusRing = false;
      this.blurEvent.emit();
      this.updateState({ touched: true });
    }
  }

  /**
   * Handles the focus event when the input field gains focus.
   * Emits a focus event and updates the focus ring state.
   */
  protected onFocus(): void {
    // Only emit the event if we don't have focus
    if (!this.hasFocusRing) {
      this.hasFocusRing = true;
      this.focusEvent.emit();
    }
  }

  /** Handles input events to update the raw and parsed values. */
  protected onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.rawValue = target.value;

    try {
      // Try to parse the value, but do nothing if it fails
      this.parseValue(this.rawValue);
      this.changeEvent.emit(this.value);
    } catch {
      /* empty */
    }

    this.updateState({ dirty: true });
    this.updateValidity();
  }

  /**
   * Handles the `keydown` event for the text field.
   * Simulates the native behavior of submitting a form when the Enter key is pressed.
   */
  protected onKeydown(event: KeyboardEvent): void {
    // Simulate native behavior where pressing Enter in a text field will submit the form
    if (!this.disabled && !this.readonly && event.key === 'Enter') {
      if (this.form) {
        this.form.requestSubmit();
      } else {
        closestElementComposed(this, 'sl-form')?.requestSubmit();
      }
    }
  }

  /**
   * Handles changes to the prefix slot. Detects and adds any `FieldButton` elements
   * assigned to the prefix slot to the `fieldButtons` state for further processing.
   */
  protected onPrefixSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const button = event.target
      .assignedElements({ flatten: true })
      .find((el): el is FieldButton => el instanceof FieldButton);

    if (button) {
      this.fieldButtons = [...this.fieldButtons, button];
    }
  }

  /**
   * Handles changes to the input slot. Updates the `input` element reference
   * and synchronizes its attributes with the component's properties.
   */
  protected onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      inputs = elements.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement);

    // If an input has been slotted after `connectedCallback`, that input takes precedence
    if (this.input && this.input !== inputs.at(0)) {
      this.input.remove();
    }

    this.input = inputs.at(0)!;
    this.input.addEventListener('blur', () => this.onBlur());
    this.input.addEventListener('focus', () => this.onFocus());
    this.updateInputElement(this.input);
    this.setFormControlElement(this.input);
  }

  /**
   * Handles changes to the suffix slot. Detects and adds any `FieldButton` elements
   * assigned to the suffix slot to the `fieldButtons` state for further processing.
   */
  protected onSuffixSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const button = event.target
      .assignedElements({ flatten: true })
      .find((el): el is FieldButton => el instanceof FieldButton);

    if (button) {
      this.fieldButtons = [...this.fieldButtons, button];
    }
  }

  /** @internal Synchronize the input element with the component properties. */
  protected updateInputElement(input: HTMLInputElement): void {
    if (!input) {
      return;
    }

    input.autofocus = this.autofocus;
    input.disabled = !!this.disabled;
    input.id ||= `sl-text-field-${nextUniqueId++}`;
    input.placeholder = this.placeholder ?? '';
    input.readOnly = !!this.readonly;
    input.required = !!this.required;

    this.setAttributesTarget(input);

    // Use `setAttribute` to avoid typing coercion
    input.setAttribute('autocomplete', this.autocomplete || 'off');

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

    if (typeof this.placeholder === 'string') {
      input.setAttribute('placeholder', this.placeholder);
    } else {
      input.removeAttribute('placeholder');
    }
  }
}
