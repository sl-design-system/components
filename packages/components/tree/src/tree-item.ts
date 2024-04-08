import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './tree-item.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree-item': TreeItem;
  }
}

export class TreeItem extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
