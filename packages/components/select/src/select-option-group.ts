import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectSize } from './select.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option-group.scss.js';

export class SelectOptionGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Select size. */
  @property({ reflect: true }) size: SelectSize = 'md';

  @property({ attribute: 'group-title' }) groupTitle?: string;

  override render(): TemplateResult {
    return html`
      ${this.#groupHeading()}
      <slot></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.groupTitle || '');
  }

  #groupHeading(): TemplateResult | void {
    if (this.groupTitle) {
      return html`<span>${this.groupTitle}</span>`;
    }
  }
}
