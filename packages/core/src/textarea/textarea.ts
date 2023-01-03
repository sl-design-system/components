import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './textarea.scss.js';

let nextUniqueId = 0;

export class Textarea extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The textarea. */
  textarea = document.createElement('textarea');

  /** No interaction is possible with this control when disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

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
    `;
  }
}
