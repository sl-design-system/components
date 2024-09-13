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

  /** The optional label for the group. */
  @property() label?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'group');
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        ${this.label ? html`<div class="label">${this.label}</div>` : nothing}
        <slot></slot>
      </div>
    `;
  }
}
