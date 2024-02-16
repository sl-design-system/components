import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import type { EventEmitter } from '@sl-design-system/shared';
import { event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './textarea.scss.js';

export type TextareaSize = 'md' | 'lg';

export type ResizeType = 'none' | 'vertical' | 'auto';

export type WrapType = 'soft' | 'hard';

let nextUniqueId = 0;

/**
 * Multi line text area component.
 *
 * @slot textarea - The slot for the textarea element
 */
@localized()
export class Textarea extends FormControlMixin(ScopedElementsMixin(LitElement)) {
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

  /** Observe the textarea width. */
  #observer = new ResizeObserver(() => {
    // Workaround for "ResizeObserver loop completed with undelivered notifications."
    requestAnimationFrame(() => this.#setSize());
  });

  /** @private Hides the external validity icon. */
  override showExternalValidityIcon = false;

  /** Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<void>;

  /** Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<string>;

  /** Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<void>;

  /** The textarea in the light DOM. */
  textarea!: HTMLTextAreaElement;

  /**
   * Specifies which type of data the browser can use to pre-fill the textarea.
   *
   * NOTE: Declare the type this way so it is backwards compatible with 4.9.5,
   * which we still use in `@sl-design-system/angular`.
   */
  @property() autocomplete?: typeof HTMLTextAreaElement.prototype.autocomplete;

  /** Whether the textarea is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether you can interact with the textarea or if it is just a static, readonly display. */
  @property({ type: Boolean }) readonly?: boolean;

  /** Whether the textarea is a required field. */
  @property({ type: Boolean }) override required?: boolean;

  /** The way the textarea can be resized. */
  @property({ reflect: true }) resize: ResizeType = 'vertical';

  /**
   * The number of rows the textarea should initially have.
   * If not set, the browser defaults to 2 rows.
   */
  @property({ type: Number }) rows?: number;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /** The size of the textarea. */
  @property({ reflect: true }) size: TextareaSize = 'md';

  /** The value for the textarea. */
  @property() override value: string = '';

  /** The way text should be wrapped during form submission. */
  @property() wrap: WrapType = 'soft';

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.textarea) {
      this.textarea =
        this.querySelector<HTMLTextAreaElement>('textarea[slot="textarea"]') || document.createElement('textarea');
      this.textarea.slot = 'textarea';
      this.#syncTextarea(this.textarea);

      if (!this.textarea.parentElement) {
        this.append(this.textarea);
      }
    }

    this.#observer.observe(this.textarea);
    this.setFormControlElement(this.textarea);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    const props: Array<keyof Textarea> = [
      'autocomplete',
      'disabled',
      'maxLength',
      'minLength',
      'placeholder',
      'readonly',
      'required',
      'rows',
      'wrap'
    ];

    if (props.some(prop => changes.has(prop))) {
      this.#syncTextarea(this.textarea);
    }

    if (changes.has('value') && this.value !== this.textarea.value) {
      this.textarea.value = this.value?.toString() || '';
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @input=${this.#onInput} @slotchange=${this.#onSlotchange} name="textarea"></slot>
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

  #onInput({ target }: Event & { target: HTMLTextAreaElement }): void {
    this.value = target.value;
    this.updateValidity();
    this.#setSize();
    this.changeEvent.emit(this.value);
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textarea = elements.find((el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement);

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textarea) {
      this.textarea = textarea;
      this.textarea.addEventListener('blur', () => this.blurEvent.emit());
      this.textarea.addEventListener('focus', () => this.focusEvent.emit());
      this.#syncTextarea(this.textarea);

      this.setFormControlElement(this.textarea);
    }
  }

  #setSize(): void {
    if (this.resize === 'auto') {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    } else {
      (this.textarea.style.height as string | undefined) = undefined;
    }
  }

  #syncTextarea(textarea: HTMLTextAreaElement): void {
    textarea.autocomplete = this.autocomplete || 'off';
    textarea.autofocus = this.autofocus;
    textarea.disabled = !!this.disabled;
    textarea.id ||= `sl-textarea-${nextUniqueId++}`;
    textarea.placeholder = this.placeholder ?? '';
    textarea.readOnly = !!this.readonly;
    textarea.required = !!this.required;
    textarea.rows = this.rows ?? 2;
    textarea.wrap = this.wrap ?? 'soft';

    if (typeof this.maxLength === 'number') {
      textarea.setAttribute('maxlength', this.maxLength.toString());
    } else {
      textarea.removeAttribute('maxlength');
    }

    if (typeof this.minLength === 'number') {
      textarea.setAttribute('minlength', this.minLength.toString());
    } else {
      textarea.removeAttribute('minlength');
    }
  }
}
