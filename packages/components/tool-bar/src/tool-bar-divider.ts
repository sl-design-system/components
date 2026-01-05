import { type CSSResultGroup, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tool-bar-divider.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar-divider': ToolBarDivider;
  }
}

export class ToolBarDivider extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Set this to true to invert the color of the divider.
   * This should be used when the tool-bar is displayed on a dark background.
   */
  @property({ type: Boolean, reflect: true }) inverted?: boolean;
}
