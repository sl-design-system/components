import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './switch.scss.js';

export class Switch extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The name of the icon to show. */
  @property() state?: string;

  override render(): TemplateResult {
    return html` <div></div>`;
  }
}
