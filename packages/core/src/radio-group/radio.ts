import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './radio.scss.js';

export class Radio extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The value for this radio button. */
  @property() value = '';

  render(): TemplateResult {
    return html`
      <div class="control"></div>
      <slot></slot>
    `;
  }
}
