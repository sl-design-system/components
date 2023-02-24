import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option-group.scss.js';

export class SelectOptionGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @property({ attribute: 'group-title' }) groupTitle?: string;

  override render(): TemplateResult {
    return html`
      <span>${this.groupTitle}</span>
      <slot></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.groupTitle || '');
  }
}
