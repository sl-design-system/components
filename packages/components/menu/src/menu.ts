import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './menu.scss.js';

export class Menu extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
