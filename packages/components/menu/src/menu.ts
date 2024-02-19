import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import styles from './menu.scss.js';
import { MenuItemGroup } from './menu-item-group.js';
import { MenuItem } from './menu-item.js';

export class Menu extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether this menu has any children that can be selected. */
  @state() selectableChildren?: boolean;

  override render(): TemplateResult {
    return html`<slot
      @slotchange=${this.#onSlotchange}
      style="--sl-menu-item-indent: ${this.selectableChildren ? '1' : '0'}"
    ></slot>`;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const assignedElements = event.target.assignedElements({ flatten: true });

    this.selectableChildren = assignedElements.some(element => {
      return (
        (element instanceof MenuItem && element.selectable) || (element instanceof MenuItemGroup && element.selects)
      );
    });
  }
}
