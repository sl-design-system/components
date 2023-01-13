import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import styles from './tab-group.scss.js';

export class TabGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot name="tabs"></slot>
      <slot></slot> `;
  }
}
