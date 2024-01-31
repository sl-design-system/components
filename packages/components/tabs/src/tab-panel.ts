import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import styles from './tab-panel.scss.js';

/**
 * A tab panel component - part of the tab group component, place for a tab content.
 *
 * ```html
 *      <sl-tab-panel>
 *        Content of the tab
 *      </sl-tab-panel>
 * ```
 *
 * @slot default - a place for the tab panel content.
 *
 */
export class TabPanel extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
  }
}
