import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './tool-bar-group.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar-group': ToolBarGroup;
  }
}

export class ToolBarGroup extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
