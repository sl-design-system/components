import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { EventsController } from '../utils/controllers/index.js';
import { HintMixin } from '../utils/form-control/index.js';
import styles from './textarea.scss.js';

let nextUniqueId = 0;

export class Textarea extends HintMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Event controller. */
  #events = new EventsController(this);

  /** The textarea. */
  textarea = document.createElement('textarea');

  /** No interaction is possible with this control when disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * Whether the form control is invalid.
   * @private
   */
  @state() invalid?: boolean;

  /** The name of the form control. */
  @property() name?: string;

  /** Placeholder text in the input. */
  @property() placeholder = '';

  /** Whether this form control is a required field. */
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /** The value of the input. */
  @property() value = '';

  constructor() {
    super();

    this.textarea.id = `sl-textarea-${nextUniqueId++}`;
    this.textarea.slot = 'textarea';
    this.append(this.textarea);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#events.listen(this, 'click', this.#onClick);
    this.#events.listen(this.textarea, 'invalid', this.#onInvalid);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.textarea.toggleAttribute('disabled', this.disabled);
    }

    if (changes.has('name')) {
      this.textarea.name = this.name ?? '';
    }

    if (changes.has('placeholder')) {
      if (this.placeholder) {
        this.textarea.setAttribute('placeholder', this.placeholder);
      } else {
        this.textarea.removeAttribute('placeholder');
      }
    }

    if (changes.has('required')) {
      this.textarea.toggleAttribute('required', this.required);
    }

    if (changes.has('value')) {
      this.textarea.value = this.value ?? '';
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper" part"wrapper">
        <slot name="textarea"></slot>
      </div>
      ${this.renderHintSlot()}
    `;
  }

  #onClick(event: Event): void {
    event.preventDefault();

    this.textarea.focus();
  }

  #onInvalid(event: Event): void {
    event.preventDefault();

    this.invalid = !this.textarea.validity.valid;
  }
}
