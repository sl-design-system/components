import { type CSSResultGroup, LitElement } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar-divider': ToolBarDivider;
  }
}
export declare class ToolBarDivider extends LitElement {
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * Set this to true to invert the color of the divider. This should be used when the tool-bar is
   * displayed on a dark background.
   */
  inverted?: boolean;
  connectedCallback(): void;
}
