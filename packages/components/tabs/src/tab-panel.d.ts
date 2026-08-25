import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-tab-panel': TabPanel;
  }
}
/**
 * A tab panel component, to be used with the tab group component for your tab content.
 *
 * ```html
 * <sl-tab-panel>Content of the tab</sl-tab-panel>
 * ```
 *
 * @slot default - A place for the tab panel content.
 */
export declare class TabPanel extends LitElement {
  /** @internal */
  static styles: CSSResultGroup;
  connectedCallback(): void;
  render(): TemplateResult;
}
