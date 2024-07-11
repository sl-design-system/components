import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button-group.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-button-group': ButtonGroup;
  }
}

export class ButtonGroup extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** If set, will disable all buttons in the group. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
