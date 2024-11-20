import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './option-group-header.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-option-group-header': OptionGroupHeader;
  }
}

/**
 * A header for an option group. Split out as a separate component so it can
 * be used both with `<lit-virtualizer>` and without.
 */
export class OptionGroupHeader extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Will render a horizontal divider when set. */
  @property({ type: Boolean, reflect: true }) divider?: boolean;

  override render(): TemplateResult {
    return html`
      ${this.divider ? html`<div class="divider"></div>` : nothing}
      <div class="wrapper">
        <slot></slot>
      </div>
    `;
  }
}
