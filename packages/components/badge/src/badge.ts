import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import styles from './badge.scss.js';

/**
 * Show totals at a glance or group.
 *
 * ```html
 * <sl-badge> 99+ </sl-badge>
 * ```
 *
 * @slot default - Contents of the badge
 */
export class badge extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  async #onSlotchange(): Promise<void> {
    console.log('change');
  }
}
