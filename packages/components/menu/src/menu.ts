import {
  type EventEmitter,
  EventsController,
  type PopoverPosition,
  RovingTabindexController,
  event
} from '@sl-design-system/shared';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { MenuItemGroup } from './menu-item-group.js';
import { MenuItem } from './menu-item.js';
import styles from './menu.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-menu': Menu;
  }
}

export type MenuEmphasis = 'subtle' | 'bold';

type MenuSide = 'top' | 'right' | 'bottom' | 'left';

let nextUniqueId = 0;

/**
 * A menu that can be used as a context menu or as a dropdown menu.
 *
 * @csspart menu - The sl-menu element, use this to set for example a min and/or max inline size of the menu
 *
 * @slot default - The menu's content: menu items or menu item groups.
 */
export class Menu extends LitElement {
  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The anchor currently linked to this menu. */
  #activeAnchor?: HTMLElement;

  /** The generated CSS anchor name, when the anchor did not already have one. */
  #generatedAnchorName?: string;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    keydown: this.#onKeydown,
    focusout: this.#onFocusout
  });

  /** The menu items. */
  #menuItems: MenuItem[] = [];

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<MenuItem>(this, {
    direction: 'vertical',
    elements: () => this.#menuItems || [],
    isFocusableElement: () => true
  });

  /**
   * The offset of the menu to its anchor. This is a property on this instance so that it can be
   * overridden by the menu item in case of a nested menu. You should not need to set this property
   * yourself.
   */
  @property({ type: Number }) offset?: number;

  /** The position of the menu relative to its anchor. */
  @property({ reflect: true }) position?: PopoverPosition = 'right-start';

  /** @internal Emits when the menu item selection changes. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<void>>;

  /** @internal Whether this menu has any children that can be selected. */
  @state() selectableChildren?: boolean;

  /** Determines whether if and how many menu items can be selected. */
  @property() selects?: 'single' | 'multiple';

  /**
   * The emphasis of the menu.
   *
   * @default 'subtle'
   */
  @property({ reflect: true }) emphasis?: MenuEmphasis;

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'menu';
    this.id ||= `sl-menu-${nextUniqueId++}`;

    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }

    this.addEventListener('beforetoggle', this.#onBeforeToggle);
    this.#linkAnchor();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('beforetoggle', this.#onBeforeToggle);
    this.#unlinkAnchor();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('offset')) {
      this.style.margin = this.offset === undefined ? '' : `${this.offset}px`;
    }

    if (changes.has('emphasis')) {
      this.#propagateEmphasis();
    }
  }

  override render(): TemplateResult {
    return html`
      <slot
        @slotchange=${this.#onSlotchange}
        @sl-select=${this.#onSelect}
        style="--sl-menu-item-indent: ${
          this.selects || this.selectableChildren ? '1' : '0'
        }"></slot>
    `;
  }

  /**
   * @internal Workaround for `delegatesFocus` on the shadowroot not taking
   * any of the menu items in the light DOM into account.
   */
  override focus(): void {
    this.#rovingTabindexController.focus();
  }

  /** @internal */
  focusLastItem(): void {
    this.#rovingTabindexController.focusToElement(this.#menuItems.length - 1);
  }

  /** @internal The side on which the menu was placed after CSS position fallbacks. */
  getPositionSide(): MenuSide {
    // Keep honoring the legacy attribute when explicitly supplied. This also makes it possible to
    // force a side in tests without relying on viewport geometry.
    const legacyPlacement = this.getAttribute('actual-placement')?.split('-')[0];
    if (this.#isMenuSide(legacyPlacement)) {
      return legacyPlacement;
    }

    const anchor = this.#getAnchorElement();
    if (anchor) {
      const anchorRect = anchor.getBoundingClientRect(),
        menuRect = this.getBoundingClientRect();

      if (menuRect.bottom <= anchorRect.top) {
        return 'top';
      } else if (menuRect.left >= anchorRect.right) {
        return 'right';
      } else if (menuRect.top >= anchorRect.bottom) {
        return 'bottom';
      } else if (menuRect.right <= anchorRect.left) {
        return 'left';
      }
    }

    return (this.position ?? 'right-start').split('-')[0] as MenuSide;
  }

  #getAnchorElement(): HTMLElement | null {
    if (this.anchorElement instanceof HTMLElement) {
      return this.anchorElement;
    }

    const anchorId = this.getAttribute('anchor');
    return anchorId ? (this.getRootNode() as Document | ShadowRoot).getElementById(anchorId) : null;
  }

  #isMenuSide(value?: string): value is MenuSide {
    return value === 'top' || value === 'right' || value === 'bottom' || value === 'left';
  }

  #linkAnchor(expanded = false): void {
    const anchor = this.#getAnchorElement();

    if (this.#activeAnchor && this.#activeAnchor !== anchor) {
      this.#unlinkAnchor();
    }

    if (!anchor) {
      return;
    }

    this.#activeAnchor = anchor;
    anchor.addEventListener('keydown', this.#onAnchorKeydown);

    const computedAnchorName = getComputedStyle(anchor).anchorName;

    if (!computedAnchorName || computedAnchorName === 'none') {
      this.#generatedAnchorName ||= `--sl-menu-anchor-${nextUniqueId++}`;
      anchor.style.anchorName = this.#generatedAnchorName;
    }

    this.style.positionAnchor = anchor.style.anchorName || computedAnchorName;

    if (!this.hasAttribute('aria-details')) {
      anchor.setAttribute('aria-details', this.id);
    }

    anchor.setAttribute('aria-expanded', expanded.toString());

    if (anchor.tagName === 'SL-BUTTON') {
      anchor.toggleAttribute('popover-opened', expanded);
    }
  }

  #onBeforeToggle = (event: ToggleEvent): void => {
    this.#linkAnchor(event.newState === 'open');
  };

  #onAnchorKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.stopPropagation();
    }
  };

  #unlinkAnchor(): void {
    if (!this.#activeAnchor) {
      return;
    }

    if (this.#activeAnchor.style.anchorName === this.#generatedAnchorName) {
      this.#activeAnchor.style.anchorName = '';
    }

    this.#activeAnchor.removeEventListener('keydown', this.#onAnchorKeydown);

    if (this.#activeAnchor.getAttribute('aria-details') === this.id) {
      this.#activeAnchor.removeAttribute('aria-details');
    }

    this.#activeAnchor.removeAttribute('aria-expanded');
    this.#activeAnchor.removeAttribute('popover-opened');
    this.style.positionAnchor = '';
    this.#activeAnchor = undefined;
  }

  #onFocusout(event: FocusEvent): void {
    if (
      this.#shouldIgnoreFocusout(event) ||
      this.#shouldKeepMenuOpen(event.relatedTarget as Node)
    ) {
      return;
    }

    this.hidePopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    // Prevent arrow keys from bubbling up to parent elements (e.g. toolbar)
    // This applies to all menus, not just submenus
    if (event.key.startsWith('Arrow')) {
      event.stopPropagation();
    }

    if (event.key === 'Escape') {
      // Prevents the Escape key event from bubbling up, so that pressing 'Escape' inside the menu
      // does not close parent containers (such as dialogs).
      event.stopPropagation();

      // If this is a submenu, close it and focus the parent menu item
      if (this.anchorElement instanceof MenuItem) {
        // Prevents closing all popovers at once
        event.preventDefault();

        this.hidePopover();
        this.anchorElement.focus();
      }
    }

    // The following logic only applies to submenus (anchored to a menu item)
    if (!(this.anchorElement instanceof MenuItem)) {
      return;
    }

    const side = this.getPositionSide();

    if (
      (side === 'right' && event.key === 'ArrowLeft') ||
      (side === 'left' && event.key === 'ArrowRight')
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
        (element instanceof MenuItem && element.selectable) ||
        (element instanceof MenuItemGroup && element.selects)
      );
    });

    this.#propagateEmphasis();

    this.#rovingTabindexController.clearElementCache();
  }

  /** Check if a menu is a direct submenu of any menu item in this menu. */
  #isDirectSubmenu(menu: Menu): boolean {
    return this.#menuItems.some(item => item.submenu === menu);
  }

  /** Check if a menu is a submenu (direct or nested) of a parent menu. */
  #isSubmenuOf(menu: Menu, parentMenu: Menu): boolean {
    let currentMenu: Menu | null = menu;

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

  #propagateEmphasis(): void {
    this.#menuItems?.forEach(item => {
      if (!(item.variant === 'danger' && item.selectable)) {
        item.emphasis = this.emphasis;
      }
    });
    const submenus = Array.from<Menu>(this.querySelectorAll('sl-menu'));
    submenus?.forEach(submenu => {
      submenu.emphasis = this.emphasis;
    });
  }

  /** Determines if the focusout event should be ignored. */
  #shouldIgnoreFocusout(event: FocusEvent): boolean {
    // Ignore focusout if this is a submenu or the event came from a submenu (not this menu)
    if (
      this.anchorElement instanceof MenuItem ||
      (event.target instanceof Menu && event.target !== this)
    ) {
      return true;
    }

    return !this.matches(':popover-open');
  }

  /** Determines if the menu should stay open based on the focus target. */
  #shouldKeepMenuOpen(relatedTarget: Node | null): boolean {
    // Don't close if focus stays within this menu or when focus moves to a menu item that belongs to this menu
    if (
      (relatedTarget && this.contains(relatedTarget)) ||
      (relatedTarget instanceof MenuItem && this.#menuItems.includes(relatedTarget))
    ) {
      return true;
    }

    // Don't close if focus moves to a submenu
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
}
