import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './option.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-option': Option;
  }
}

export class Option extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether the option is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
