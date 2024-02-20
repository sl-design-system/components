import { type EventEmitter, EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './menu.scss.js';
import { MenuItemGroup } from './menu-item-group.js';
import { MenuItem } from './menu-item.js';

export class Menu extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick
  });

  /** The menu items. */
  #menuItems: MenuItem[] = [];

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<MenuItem>(this, {
    focusInIndex: (elements: MenuItem[]) => elements.findIndex(el => !el.disabled),
    elements: () => this.#menuItems || [],
    isFocusableElement: (el: MenuItem) => !el.disabled
  });

  /** Emits when the menu item selection changes. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<void>;

  /** Whether this menu has any children that can be selected. */
  @state() selectableChildren?: boolean;

  /** Determines whether if and how many menu items can be selected. */
  @property() selects?: 'single' | 'multiple';

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'menu';
    this.setAttribute('popover', '');
  }

  override render(): TemplateResult {
    return html`
      <slot
        @slotchange=${this.#onSlotchange}
        @sl-select=${this.#onSelect}
        style="--sl-menu-item-indent: ${this.selects || this.selectableChildren ? '1' : '0'}"
      ></slot>
    `;
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.#rovingTabindexController.focus();
    }
  }

  async #onSelect(event: Event): Promise<void> {
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

      // Wait for the select event from the menu item to finish
      // emitting before emitting our own select event.
      await this.updateComplete;

      this.selectEvent.emit();
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    let menuItems: MenuItem[];

    if (this.querySelector('slot:not([name])')) {
      menuItems = event.target
        .assignedElements({ flatten: true })
        .filter((element): element is MenuItem => element instanceof MenuItem);
    } else {
      menuItems = Array.from(this.querySelectorAll('sl-menu-item')).filter(
        element => element.closest('sl-menu') === this
      );
    }

    this.#menuItems = menuItems;

    this.selectableChildren = menuItems.some(element => {
      return (
        (element instanceof MenuItem && element.selectable) || (element instanceof MenuItemGroup && element.selects)
      );
    });

    this.#rovingTabindexController.clearElementCache();
  }
}
