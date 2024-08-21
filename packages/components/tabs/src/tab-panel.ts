import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './tab-panel.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tab-panel': TabPanel;
  }
}

/**
 * A tab panel component, to be used with the tab group component for your tab content.
 *
 * ```html
 *   <sl-tab-panel>Content of the tab</sl-tab-panel>
 * ```
 *
 * @slot default - A place for the tab panel content.
 */
export class TabPanel extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'tabpanel');
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
