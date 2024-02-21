import {
  AnchorController,
  type EventEmitter,
  EventsController,
  type PopoverPosition,
  RovingTabindexController,
  event
} from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './menu.scss.js';
import { MenuItemGroup } from './menu-item-group.js';
import { MenuItem } from './menu-item.js';

export class Menu extends LitElement {
  /** The default offset of the menu to its anchor. */
  static offset = 4;

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The default margin between the menu and the viewport. */
  static viewportMargin = 8;

  /** Controller for managing anchoring. */
  #anchor = new AnchorController(this, { offset: Menu.offset, viewportMargin: Menu.viewportMargin });

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown,
    toggle: this.#onToggle
  });

  /** The menu items. */
  #menuItems: MenuItem[] = [];

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<MenuItem>(this, {
    direction: 'vertical',
    elements: () => this.#menuItems || [],
    focusInIndex: (elements: MenuItem[]) => elements.findIndex(el => !el.disabled),
    isFocusableElement: (el: MenuItem) => !el.disabled
  });

  /** The position of the menu relative to its anchor. */
  @property() position?: PopoverPosition = 'right-start';

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

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('position')) {
      this.#anchor.position = this.position;
    }
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

  override focus(options?: FocusOptions): void {
    this.#rovingTabindexController.focus(options);
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.focus();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (!(this.anchorElement instanceof MenuItem)) {
      return;
    }

    const placement = this.getAttribute('actual-placement');

    if (
      (placement?.startsWith('right') && event.key === 'ArrowLeft') ||
      (placement?.startsWith('left') && event.key === 'ArrowRight')
    ) {
      this.hidePopover();
      this.anchorElement.focus();
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
      // Find all slotted nested menu items
      menuItems = event.target
        .assignedElements({ flatten: true })
        .map(element => {
          if (element instanceof MenuItem) {
            return [element];
          } else {
            return Array.from(element.querySelectorAll('sl-menu-item'));
          }
        })
        .flat(2);
    } else {
      // Find all nested menu items in the light DOM
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

  #onToggle(event: Event): void {
    if ((event as ToggleEvent).newState === 'closed' && this.anchorElement instanceof MenuItem) {
      this.anchorElement.focus();
    }
  }
}
