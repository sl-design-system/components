import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { IElementInternals } from 'element-internals-polyfill';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './radio.scss.js';

export class Radio extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #onClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();

    this.checked = !this.checked;
  };

  protected internals: ElementInternals & IElementInternals;

  /** Whether the radio is selected. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Wether this radio is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The value for this radio button. */
  @property() value = '';

  constructor() {
    super();

    this.internals = this.attachInternals();
    this.internals.role = 'radio';
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('click', this.#onClick);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick);

    super.disconnectedCallback();
  }

  updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked')) {
      this.internals.ariaChecked = this.checked ? 'true' : 'false';

      if (this.checked) {
        this.internals.states.add('--checked');
      } else {
        this.internals.states.delete('--checked');
      }
    }
  }

  render(): TemplateResult {
    return html`
      <div class="control"></div>
      <slot></slot>
    `;
  }
}
