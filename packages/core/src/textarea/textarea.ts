import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { IElementInternals } from 'element-internals-polyfill';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { EventsController } from '../utils/controllers/index.js';
import { FormControlMixin, validationStyles } from '../utils/form-control/index.js';
import styles from './textarea.scss.js';

let nextUniqueId = 0;

export class Textarea extends FormControlMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

  /** Event controller. */
  #events = new EventsController(this);

  /** Element internals. */
  readonly internals = this.attachInternals() as ElementInternals & IElementInternals;

  /** The textarea in the light DOM. */
  textarea!: HTMLTextAreaElement;

  /** Maximum length (number of characters). */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the input. */
  @property() placeholder?: string;

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
    }

    this.#events.listen(this, 'click', this.#onClick);
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
  }

  override render(): TemplateResult {
    return html`
      <div @input=${this.#onInput} class="wrapper">
        <slot @slotchange=${this.#onSlotchange} name="textarea"></slot>
      </div>
      ${this.renderHint()} ${this.renderValidation()}
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
      this.textarea = textareas.at(0) as HTMLTextAreaElement;
      this.textarea.id ||= `sl-input-${nextUniqueId++}`;

      this.setFormControlElement(this.textarea);
    }
  }
}
