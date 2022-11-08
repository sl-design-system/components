import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import styles from './tooltip.scss.js';

export class Tooltip extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
