var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import {
  AnchorController,
  EventsController,
  RovingTabindexController,
  event
} from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { MenuItemGroup } from './menu-item-group.js';
import { MenuItem } from './menu-item.js';
import styles from './menu.scss.js';
const _Menu = class _Menu extends LitElement {
  constructor() {
    super(...arguments);
    /** Controller for managing anchoring. */
    this.#anchor = new AnchorController(this, {
      offset: _Menu.offset,
      viewportMargin: _Menu.viewportMargin
    });
    // eslint-disable-next-line no-unused-private-class-members
    this.#events = new EventsController(this, {
      keydown: this.#onKeydown,
      focusout: this.#onFocusout
    });
    /** The menu items. */
    this.#menuItems = [];
    /** Manage the keyboard navigation. */
    this.#rovingTabindexController = new RovingTabindexController(this, {
      direction: 'vertical',
      elements: () => this.#menuItems || [],
      focusInIndex: elements => elements.findIndex(el => !el.disabled),
      isFocusableElement: el => !el.disabled
    });
    this.position = 'right-start';
  }
  static {
    /** @internal The default offset of the menu to its anchor. */
    this.offset = 6;
  }
  static {
    /** @internal */
    this.shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  static {
    /** @internal The default margin between the menu and the viewport. */
    this.viewportMargin = 8;
  }
  #anchor;
  #events;
  #menuItems;
  #rovingTabindexController;
  connectedCallback() {
    super.connectedCallback();
    this.role = 'menu';
    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('offset')) {
      this.#anchor.offset = this.offset;
    }
    if (changes.has('position')) {
      this.#anchor.position = this.position;
    }
    if (changes.has('emphasis')) {
      this.#propagateEmphasis();
    }
  }
  render() {
    return html`
      <slot
        @slotchange=${this.#onSlotchange}
        @sl-select=${this.#onSelect}
        style="--sl-menu-item-indent: ${this.selects || this.selectableChildren ? '1' : '0'}"></slot>
    `;
  }
  /**
   * @internal Workaround for `delegatesFocus` on the shadowroot not taking
   * any of the menu items in the light DOM into account.
   */
  focus() {
    this.#rovingTabindexController.focus();
  }
  /** @internal */
  focusLastItem() {
    this.#rovingTabindexController.focusToElement(this.#menuItems.length - 1);
  }
  #onFocusout(event2) {
    if (this.#shouldIgnoreFocusout(event2) || this.#shouldKeepMenuOpen(event2.relatedTarget)) {
      return;
    }
    this.hidePopover();
  }
  #onKeydown(event2) {
    if (event2.key.startsWith('Arrow')) {
      event2.stopPropagation();
    }
    if (event2.key === 'Escape') {
      event2.stopPropagation();
      if (this.anchorElement instanceof MenuItem) {
        event2.preventDefault();
        this.hidePopover();
        this.anchorElement.focus();
      }
    }
    if (!(this.anchorElement instanceof MenuItem)) {
      return;
    }
    const placement = this.getAttribute('actual-placement');
    if (
      (placement?.startsWith('right') && event2.key === 'ArrowLeft') ||
      (placement?.startsWith('left') && event2.key === 'ArrowRight')
    ) {
      this.hidePopover();
      this.anchorElement.focus();
    }
  }
  async #onSelect(event2) {
    if (this.selects && this.#menuItems.includes(event2.target)) {
      event2.preventDefault();
      event2.stopPropagation();
      if (this.selects === 'single') {
        this.#menuItems.forEach(item => {
          if (item !== event2.target) {
            item.selected = false;
          }
        });
      }
      await this.updateComplete;
      this.selectEvent.emit();
    }
  }
  #onSlotchange(event2) {
    let menuItems;
    if (this.querySelector('slot:not([name])')) {
      menuItems = event2.target
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
      menuItems = Array.from(this.querySelectorAll('sl-menu-item')).filter(
        element => element.closest('sl-menu') === this
      );
    }
    this.#menuItems = menuItems;
    this.selectableChildren = menuItems.some(element => {
      return (
        (element instanceof MenuItem && element.selectable) ||
        (element instanceof MenuItemGroup && element.selects)
      );
    });
    this.#propagateEmphasis();
    this.#rovingTabindexController.clearElementCache();
  }
  /** Check if a menu is a direct submenu of any menu item in this menu. */
  #isDirectSubmenu(menu) {
    return this.#menuItems.some(item => item.submenu === menu);
  }
  /** Check if a menu is a submenu (direct or nested) of a parent menu. */
  #isSubmenuOf(menu, parentMenu) {
    let currentMenu = menu;
    while (currentMenu) {
      if (currentMenu === parentMenu) {
        return true;
      }
      if (!currentMenu.anchorElement || !(currentMenu.anchorElement instanceof MenuItem)) {
        return false;
      }
      currentMenu = currentMenu.anchorElement.closest('sl-menu');
    }
    return false;
  }
  #propagateEmphasis() {
    this.#menuItems?.forEach(item => {
      if (!(item.variant === 'danger' && item.selectable)) {
        item.emphasis = this.emphasis;
      }
    });
    const submenus = Array.from(this.querySelectorAll('sl-menu'));
    submenus?.forEach(submenu => {
      submenu.emphasis = this.emphasis;
    });
  }
  /** Determines if the focusout event should be ignored. */
  #shouldIgnoreFocusout(event2) {
    if (
      this.anchorElement instanceof MenuItem ||
      (event2.target instanceof _Menu && event2.target !== this)
    ) {
      return true;
    }
    return !this.matches(':popover-open');
  }
  /** Determines if the menu should stay open based on the focus target. */
  #shouldKeepMenuOpen(relatedTarget) {
    if (
      (relatedTarget && this.contains(relatedTarget)) ||
      (relatedTarget instanceof MenuItem && this.#menuItems.includes(relatedTarget))
    ) {
      return true;
    }
    if (relatedTarget instanceof HTMLElement) {
      const targetMenu = relatedTarget.closest('sl-menu');
      if (
        targetMenu &&
        (this.#isDirectSubmenu(targetMenu) || this.#isSubmenuOf(targetMenu, this))
      ) {
        return true;
      }
    }
    return false;
  }
};
__decorateClass([property({ type: Number })], _Menu.prototype, 'offset', 2);
__decorateClass([property()], _Menu.prototype, 'position', 2);
__decorateClass([event({ name: 'sl-select' })], _Menu.prototype, 'selectEvent', 2);
__decorateClass([state()], _Menu.prototype, 'selectableChildren', 2);
__decorateClass([property()], _Menu.prototype, 'selects', 2);
__decorateClass([property({ reflect: true })], _Menu.prototype, 'emphasis', 2);
export let Menu = _Menu;
//# sourceMappingURL=menu.js.map
