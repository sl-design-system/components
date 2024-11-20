import { Option } from '@sl-design-system/listbox';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './grouped-option.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-grouped-option': GroupedOption;
  }
}

/**
 * An option in a combobox that is grouped. This is a special type of option that displays a group label.
 *
 * @slot default - The option's label.
 */
export class GroupedOption extends Option {
  /** @internal */
  static override styles: CSSResultGroup = [Option.styles, styles];

  /** The group this option belongs to. */
  @property() group?: string;

  override render(): TemplateResult {
    return html`
      <div part="container">
        <sl-icon name="check"></sl-icon>
        <div part="wrapper">
          <slot></slot>
          <span part="group">${this.group}</span>
        </div>
      </div>
    `;
  }
}
