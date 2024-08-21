import { type CSSResultGroup, LitElement } from 'lit';
import styles from './tool-bar-divider.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar-divider': ToolBarDivider;
  }
}

export class ToolBarDivider extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;
}
