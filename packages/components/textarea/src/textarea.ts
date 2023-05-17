import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '@sl-design-system/shared';
import {
  EventsController,
  FormControlMixin,
  HintMixin,
  ValidationController,
  validationStyles
} from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './textarea.scss.js';

export type TextareaSize = 'md' | 'lg';

export type ResizeType = 'none' | 'vertical'; // TODO: add auto?
// 'none' | 'both' | 'horizontal' | 'vertical';

let nextUniqueId = 0;

/**
 * Single line text input component.
 *
 * @slot textarea - The slot for the textarea element
 */
export class Textarea extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

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

  /** Textarea size. */
  @property({ reflect: true }) resize: ResizeType = 'vertical'; // TODO: add auto?

  /** Textarea size. */
  @property({ reflect: true }) size: TextareaSize = 'md';

  // TODO resize vertical / horizontal /  none? maybe vertical by default?

  /** The number of rows. */
  @property({ type: Number }) rows = 3;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.textarea) {
      this.textarea =
        this.querySelector<HTMLTextAreaElement>('textarea[slot="input"]') || document.createElement('textarea');
      this.textarea.id ||= `sl-textarea-${nextUniqueId++}`;
      this.textarea.slot = 'textarea';

      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      }

      if (!this.textarea.parentElement) {
        this.append(this.textarea);
      }

      this.setFormControlElement(this.textarea);

      this.#validation.validate(this.value);
    }
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

    if (changes.has('rows')) {
      if (this.rows) {
        this.textarea.setAttribute('rows', this.rows.toString());
      } else {
        this.textarea.removeAttribute('rows');
      }
    }

    if (changes.has('readonly')) {
      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      } else {
        this.textarea.removeAttribute('readonly');
      }
    }

    if (changes.has('value') && this.value !== this.textarea.value) {
      this.textarea.value = this.value || '';
    }
  }

  // TODO: add focus-visible-within attribute

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} class="wrapper">
        <slot @slotchange=${this.#onSlotchange} name="textarea"></slot>
        <slot name="suffix">
          <sl-icon name="face-smile" size="lg"></sl-icon>
        </slot>
      </div>
      ${this.renderHint()} ${this.#validation.render()}
    `; //         <span>Place for icon</span>
  }

  // <sl-icon class="invalid-icon" name="fas-triangle-exclamation" size=${this.size}></sl-icon>
  //           ${this.valid ? html`<sl-icon class="valid-icon" name="fas-circle-check" size=${this.size}></sl-icon>` : null}

  #onClick(event: Event): void {
    if (event.target === this.textarea) {
      event.preventDefault();

      this.textarea.focus();
    }
  }

  #onInput({ target }: Event & { target: HTMLTextAreaElement }): void {
    this.value = target.value;
    this.#validation.validate(this.value);
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textareas = elements.filter(
        (el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement && el !== this.textarea
      );

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textareas.length) {
      this.textarea = textareas[0];
      this.textarea.id ||= `sl-input-${nextUniqueId++}`;

      if (this.readonly) {
        this.textarea.readOnly = this.readonly;
      }

      this.setFormControlElement(this.textarea);
    }
  }
}
