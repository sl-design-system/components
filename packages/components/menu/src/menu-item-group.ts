import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './menu-item-group.scss.js';
import { MenuItem } from './menu-item.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-item-group': MenuItemGroup;
  }
}

/**
 * A group of menu items, use this if you want to group menu items in a menu with
 * other menu items.
 *
 * @slot default - The menu items within a group.
 * @slot header - The header of the group.
 */
export class MenuItemGroup extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The slotted menu items. */
  #menuItems: MenuItem[] = [];

  /** The optional heading for the group. */
  @property() heading?: string;

  /** Determines whether if and how many menu items can be selected within this group. */
  @property() selects?: 'single' | 'multiple';

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <slot name="header">${this.heading ? html`<div class="heading">${this.heading}</div>` : nothing}</slot>
        <slot @slotchange=${this.#onSlotchange} @sl-select=${this.#onSelect}></slot>
      </div>
    `;
  }

  #onSelect(event: Event): void {
    if (!this.selects) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.selects === 'single') {
      this.#menuItems.forEach(item => {
        if (item !== event.target) {
          item.selected = false;
        }
      });
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.#menuItems = event.target
      .assignedElements({ flatten: true })
      .filter((element): element is MenuItem => element instanceof MenuItem);
  }
}
