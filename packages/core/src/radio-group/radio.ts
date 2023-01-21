import type { IElementInternals } from 'element-internals-polyfill';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { EventsController } from '../utils/controllers/index.js';
import styles from './radio.scss.js';

export class Radio extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** Whether the radio is selected. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Wether this radio is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The value for this radio button. */
  @property() value = '';

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'radio';

    // Move this to a new `FocusableMixin`
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.internals.ariaChecked = this.checked ? 'true' : 'false';

      if (this.checked) {
        (this.internals as IElementInternals).states.add('--checked');
      } else {
        (this.internals as IElementInternals).states.delete('--checked');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="control"></div>
      <slot></slot>
    `;
  }

  #onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.checked = true;
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      this.click();
    }
  }
}
