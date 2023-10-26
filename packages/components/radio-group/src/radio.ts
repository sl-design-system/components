import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './radio.scss.js';

export type RadioButtonSize = 'md' | 'lg';

export class Radio extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** Whether the radio is checked. */
  @property({ type: Boolean, reflect: true }) checked?: boolean;

  /** Whether the radio is checked. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * The size of the radio button.
   * @type {'md' | 'lg'}
   */
  @property({ reflect: true }) size: RadioButtonSize = 'md';

  /** The value for this radio button. */
  @property() value: string | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'radio');

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    }

    if (changes.has('disabled')) {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="box">
        ${this.checked
          ? html`
              <svg aria-hidden="true" focusable="false" part="svg" version="1.1" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6"></circle>
              </svg>
            `
          : html`<svg aria-hidden="true" focusable="false" part="svg" version="1.1" viewBox="0 0 24 24"></svg>`}
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
