import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Validator } from '../utils/index.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { EventsController, ValidationController, validationStyles } from '../utils/controllers/index.js';
import { FormControlMixin, HintMixin, hintStyles } from '../utils/mixins/index.js';
import styles from './textarea.scss.js';

let nextUniqueId = 0;

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

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

  /** Custom validators specified by the user. */
  @property({ attribute: false }) validators?: Validator[];

  /** The value for the textarea. */
  @property() value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.textarea) {
      this.textarea =
        this.querySelector<HTMLTextAreaElement>('textarea[slot="input"]') || document.createElement('textarea');
      this.textarea.id ||= `sl-textarea-${nextUniqueId++}`;
      this.textarea.slot = 'textarea';

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

    if (changes.has('value') && this.value !== this.textarea.value) {
      this.textarea.value = this.value || '';
    }
  }

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} class="wrapper">
        <slot @slotchange=${this.#onSlotchange} name="textarea"></slot>
      </div>
      ${this.#validation.render() ? this.#validation.render() : this.renderHint()}
    `; // ${this.renderHint()} ${this.#validation.render()}
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
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textareas = elements.filter(
        (el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement && el !== this.textarea
      );

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textareas.length) {
      this.textarea = textareas.at(0) as HTMLTextAreaElement;
      this.textarea.id ||= `sl-input-${nextUniqueId++}`;

      this.setFormControlElement(this.textarea);
    }
  }
}
