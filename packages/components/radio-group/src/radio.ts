import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { FormControlShowValidity } from '@sl-design-system/form';
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './radio.scss.js';

export type RadioButtonSize = 'md' | 'lg';

export class Radio extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** Whether the radio is checked. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** Whether this radio button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Indicates if the radio button shows it is (in)valid. */
  @property({ attribute: 'show-validity', reflect: true }) showValidity: FormControlShowValidity;

  /** The size of the radio button. */
  @property({ reflect: true }) size: RadioButtonSize = 'md';

  /** The value for this radio button. */
  @property() value: string | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'radio');

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    }

    if (changes.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="box">
        ${this.checked
          ? html`
              <svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6"></circle>
              </svg>
            `
          : html`<svg version="1.1" aria-hidden="true" part="svg" viewBox="0 0 24 24"></svg>`}
      </div>
      <span class="label">
        <slot></slot>
      </span>
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.checked = true;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      this.#onClick(event);
    }
  }
}
