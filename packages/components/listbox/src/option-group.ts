import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './option-group.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-option-group': OptionGroup;
  }
}

/**
 * An option group in a list, such as select or combobox.
 *
 * @slot default - The option's label.
 */
export class OptionGroup extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The optional heading for the group. */
  @property() heading?: string;

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <slot name="header">${this.heading ? html`<div class="heading">${this.heading}</div>` : nothing}</slot>
        <slot></slot>
      </div>
    `;
  }
}
