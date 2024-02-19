import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './menu.scss.js';
import { MenuItemGroup } from './menu-item-group.js';
import { MenuItem } from './menu-item.js';

export class Menu extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #menuItems: MenuItem[] = [];

  /** Whether this menu has any children that can be selected. */
  @state() selectableChildren?: boolean;

  /** Determines whether if and how many menu items can be selected. */
  @property() selects?: 'single' | 'multiple';

  override render(): TemplateResult {
    return html`
      <slot
        @slotchange=${this.#onSlotchange}
        @sl-select=${this.#onSelect}
        style="--sl-menu-item-indent: ${this.selects || this.selectableChildren ? '1' : '0'}"
      ></slot>
    `;
  }

  #onSelect(event: CustomEvent<boolean>): void {
    if (this.selects && this.#menuItems.includes(event.target as MenuItem)) {
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
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true });

    this.#menuItems = assignedElements.filter((element): element is MenuItem => element instanceof MenuItem);

    this.selectableChildren = assignedElements.some(element => {
      return (
        (element instanceof MenuItem && element.selectable) || (element instanceof MenuItemGroup && element.selects)
      );
    });
  }
}
