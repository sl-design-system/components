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
import styles from './textarea.scss.js';

export type TextareaSize = 'md' | 'lg';

export type ResizeType = 'none' | 'vertical' | 'auto';

export type WrapType = 'soft' | 'hard';

let nextUniqueId = 0;

/**
 * Single line text input component.
 *
 * @slot textarea - The slot for the textarea element
 */
export class Textarea extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static override styles: CSSResultGroup = [validationStyles, hintStyles, styles];

  #events = new EventsController(this, {
    click: this.#onClick
  });

  #validation = new ValidationController(this, {
    target: () => this.textarea
  });

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** The textarea in the light DOM. */
  textarea!: HTMLTextAreaElement;

  /** Observe the grid width. */
  #resizeObserver?: ResizeObserver;

  /** Specifies which type of data the browser can use to pre-fill the input. */
  @property() autocomplete?: string;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Whether you can interact with the textarea or if it is just a static, readonly display. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Custom validators specified by the user. */
  @property({ attribute: false }) validators?: Validator[];

  /** The value for the textarea. */
  @property() value?: string;

  /** Whether the textarea is valid. */
  @property({ type: Boolean, reflect: true }) valid?: boolean;

  /** Whether the textarea should get valid styles when is valid. */
  @property({ type: Boolean, reflect: true }) showValid = false;

  /** Specifies how textarea can be resized. */
  @property({ reflect: true }) resize: ResizeType = 'vertical';

  /** Textarea size. */
  @property({ reflect: true }) size: TextareaSize = 'md';

  /** Specifies how the text should be wrapped during form submission. */
  @property({ reflect: true }) wrap?: WrapType = 'soft';

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

      this.#validation.validate(this.value);
    }

    this.#resizeObserver = new ResizeObserver(() => this.#setSize());

    this.#resizeObserver?.observe(this.textarea);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#resizeObserver?.unobserve(this.textarea);
    this.#resizeObserver = undefined;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('maxLength')) {
      if (this.maxLength) {
        this.textarea.setAttribute('maxlength', this.maxLength.toString());
      } else {
        this.textarea.removeAttribute('maxlength');
      }
    }

    if (changes.has('minLength')) {
      if (this.minLength) {
        this.textarea.setAttribute('minlength', this.minLength.toString());
      } else {
        this.textarea.removeAttribute('minlength');
      }
    }

    if (changes.has('placeholder')) {
      if (this.placeholder) {
        this.textarea.setAttribute('placeholder', this.placeholder);
      } else {
        this.textarea.removeAttribute('placeholder');
      }
    }

    if (changes.has('autocomplete')) {
      if (this.autocomplete) {
        this.textarea.setAttribute('autocomplete', this.autocomplete);
      } else {
        this.textarea.removeAttribute('autocomplete');
      }
    }

    if (changes.has('resize')) {
      if (this.resize) {
        this.textarea.setAttribute('resize', this.resize);
      } else {
        this.resize = 'vertical';
        this.textarea.setAttribute('resize', this.resize);
      }
    }

    if (changes.has('readonly')) {
      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      } else {
        this.textarea.removeAttribute('readonly');
      }
    }

    if (changes.has('wrap')) {
      if (this.wrap) {
        this.textarea.wrap = this.wrap;
      } else {
        this.wrap = 'soft';
        this.textarea.setAttribute('wrap', this.wrap);
      }
    }

    if (changes.has('value') && this.value !== this.textarea.value) {
      this.textarea.value = this.value || '';
    }
  }

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} class="wrapper">
        <slot @slotchange=${this.#onSlotchange} name="textarea"></slot>
        <slot name="suffix">
          <sl-icon class="invalid-icon" name="triangle-exclamation-solid" size="lg"></sl-icon>
          ${this.valid ? html`<sl-icon class="valid-icon" name="circle-check-solid" size="lg"></sl-icon>` : null}
        </slot>
      </div>
      ${this.#validation.render() ? this.#validation.render() : this.renderHint()}
    `;
  }

  #onClick(event: Event): void {
    if (event.target === this.textarea) {
      event.preventDefault();

      this.textarea.focus();
    }
  }

  #onInput({ target }: Event & { target: HTMLTextAreaElement }): void {
    this.value = target.value;
    this.#validation.validate(this.value);

    this.#setSize();
  }

  #setSize(): void {
    if (this.resize === 'auto') {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    } else {
      (this.textarea.style.height as string | undefined) = undefined;
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textareas = elements.filter(
        (el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement && el !== this.textarea
      );

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textareas.length) {
      this.textarea = textareas[0];
      this.textarea.autocomplete ||= this.autocomplete || 'off';
      this.textarea.id ||= `sl-textarea-${nextUniqueId++}`;

      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      }

      if (this.wrap) {
        this.textarea.wrap = this.wrap;
      }

      this.setFormControlElement(this.textarea);
    }
  }
}
