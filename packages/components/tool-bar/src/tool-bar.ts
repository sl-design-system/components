import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './tool-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar': ToolBar;
  }
}

export class ToolBar extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot>HOHOHO</slot>`;
  }
}
