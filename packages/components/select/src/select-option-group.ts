import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectSize } from './select.js';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option-group.scss.js';

export class SelectOptionGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Select size. */
  @property({ reflect: true }) size: SelectSize = 'md';

  @property({ attribute: 'group-heading' }) groupHeading?: string;

  override render(): TemplateResult {
    return html`
      ${this.groupHeading ? html`<span>${this.groupHeading}</span>` : nothing}
      <slot></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.groupHeading || '');
  }
}
