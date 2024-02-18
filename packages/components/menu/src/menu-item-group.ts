import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './menu-item-group.scss.js';

export class MenuItemGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Determines whether if and how many menu items can be selected. */
  @property() selects?: 'single' | 'multiple';

  override render(): TemplateResult {
    return html`
      <slot name="header"></slot>
      <slot></slot>
    `;
  }
}
