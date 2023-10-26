import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Icon } from '@sl-design-system/icon';
import { FormControlMixin, HintMixin, hintStyles, validationStyles } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './textarea.scss.js';

export type TextareaSize = 'md' | 'lg';

export type ResizeType = 'none' | 'vertical' | 'auto';

export type WrapType = 'soft' | 'hard';

let nextUniqueId = 0;

/**
 * Multi line text input component.
 *
 * @slot textarea - The slot for the textarea element
 */
export class Textarea extends FormControlMixin(HintMixin(ScopedElementsMixin(LitElement))) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, hintStyles, styles];

  /** Observe the textarea width. */
  #resizeObserver?: ResizeObserver;

  /** The textarea in the light DOM. */
  textarea!: HTMLTextAreaElement;

  /**
   * Specifies which type of data the browser can use to pre-fill the textarea.
   *
   * NOTE: Declare the type this way so it is backwards compatible with 4.9.5,
   * which we still use in `@sl-design-system/angular`.
   */
  @property() autocomplete?: typeof HTMLInputElement.prototype.autocomplete;

  /** Whether the text input is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether you can interact with the textarea or if it is just a static, readonly display. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Whether the text input is a required field. */
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /**
   * The way the textarea can be resized.
   * @type {'none' | 'vertical' | 'auto'}
   */
  @property({ reflect: true }) resize: ResizeType = 'vertical';

  /** Whether the textarea should get valid styles when is valid. */
  @property({ type: Boolean, attribute: 'show-valid' }) showValid?: boolean;

  /**
   * The size of the textarea.
   * @type {'md' | 'lg'}
   */
  @property({ reflect: true }) size: TextareaSize = 'md';

  /** The value for the textarea. */
  @property() value: string | null = null;

  /**
   * The text way should be wrapped during form submission.
   * @type {'soft' | 'hard'}
   */
  @property({ reflect: true }) wrap: WrapType = 'soft';

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.textarea) {
      this.textarea =
        this.querySelector<HTMLTextAreaElement>('textarea[slot="input"]') || document.createElement('textarea');
      this.textarea.autocomplete ||= this.autocomplete || 'off';
      this.textarea.id ||= `sl-textarea-${nextUniqueId++}`;
      this.textarea.slot = 'textarea';

      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      }

      if (this.wrap) {
        this.textarea.wrap = this.wrap;
      }

      if (!this.textarea.parentElement) {
        this.append(this.textarea);
      }

      this.setFormControlElement(this.textarea);
    }

    this.#resizeObserver = new ResizeObserver(() => {
      if (this.resize === 'auto') {
        this.textarea.style.height = 'auto';
        this.textarea.style.height = `${this.textarea.scrollHeight}px`;
      } else {
        (this.textarea.style.height as string | undefined) = undefined;
      }
    });
    this.#resizeObserver.observe(this.textarea);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;

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
      'wrap'
    ];

    if (props.some(prop => changes.has(prop))) {
      this.#syncTextarea(this.textarea);
    }

    if (changes.has('value') && this.value !== this.textarea.value) {
      this.textarea.value = this.value || '';
    }
  }

  override render(): TemplateResult {
    return html`
      <div @click=${this.#onClick} class="wrapper" part="wrapper">
        <slot @input=${this.#onInput} @slotchange=${this.#onSlotchange} name="textarea"></slot>
        <slot name="suffix">
          ${this.showValidity === 'invalid'
            ? html`<sl-icon class="invalid-icon" name="triangle-exclamation-solid" size="lg"></sl-icon>`
            : nothing}
          ${this.showValidity === 'valid' && this.showValid
            ? html`<sl-icon class="valid-icon" name="circle-check-solid" size="lg"></sl-icon>`
            : nothing}
        </slot>
      </div>

      <div class="error" part="error">${this.renderErrorSlot()}</div>
      <div class="hint" part="hint">${this.renderHintSlot()}</div>
    `;
  }

  #onClick(event: Event): void {
    event.preventDefault();

    this.textarea.focus();
  }

  #onInput({ target }: Event & { target: HTMLTextAreaElement }): void {
    this.value = target.value;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textareas = elements.filter(
        (el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement && el !== this.textarea
      );

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textareas.length) {
      this.textarea = textareas[0];
      this.#syncTextarea(this.textarea);

      this.setFormControlElement(this.textarea);
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
    textarea.wrap = this.wrap;

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
