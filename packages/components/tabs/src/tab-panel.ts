import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './tab-panel.scss.js';

/**
 * A tab panel component, to be used with the tab group component for your tab content.
 *
 * ```html
 *   <sl-tab-panel>Content of the tab</sl-tab-panel>
 * ```
 *
 * @slot default - a place for the tab panel content.
 *
 */
export class TabPanel extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'tabpanel');
  }
}
