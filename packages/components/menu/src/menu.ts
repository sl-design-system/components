import {
  type EventEmitter,
  EventsController,
  type PopoverPosition,
  RovingTabindexController,
  event,
  positionPopover
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
type CSSAnchorElement = Element & ElementCSSInlineStyle;

const minMenuSize = 25,
  viewportMargin = 8,
  javascriptPositionProperties = [
    'inset-block-start',
    'inset-inline-start',
    'max-block-size',
    'max-inline-size',
    'min-block-size'
  ] as const;

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
  #activeAnchor?: CSSAnchorElement;

  /** The generated CSS anchor name, when the anchor did not already have one. */
  #generatedAnchorName?: string;

  /** The inline anchor name declaration replaced by a generated name. */
  #previousInlineAnchorName?: { value: string; priority: string };

  /** Event listeners and observers that only run while the menu is open. */
  #openController?: AbortController;

  /** Cleanup for the JavaScript fallback used by anchors in a different tree scope. */
  #positionCleanup?: () => void;

  /** Watches the anchor for size changes that affect the available viewport space. */
  #resizeObserver?: ResizeObserver;

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
    this.addEventListener('toggle', this.#onToggle);
    this.#linkAnchor();
    this.#updateAnchorState(false);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('beforetoggle', this.#onBeforeToggle);
    this.removeEventListener('toggle', this.#onToggle);
    this.#stopJavaScriptPositioning();
    this.#stopSizing();
    this.#unlinkAnchor();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('offset')) {
      if (this.offset === undefined) {
        this.style.removeProperty('--_menu-offset');
      } else {
        this.style.setProperty('--_menu-offset', `${this.offset}px`);
      }
    }

    if (changes.has('offset') || changes.has('position')) {
      const anchor = this.#getAnchorElement();

      if (anchor && this.matches(':popover-open') && this.#requiresJavaScriptPositioning(anchor)) {
        this.#startJavaScriptPositioning(anchor);
      } else {
        this.#updateMaxSize();
      }
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

  #getAnchorElement(): CSSAnchorElement | null {
    const anchorId = this.getAttribute('anchor'),
      anchor =
        this.anchorElement ??
        (anchorId ? (this.getRootNode() as Document | ShadowRoot).getElementById(anchorId) : null);

    return anchor && 'style' in anchor ? (anchor as CSSAnchorElement) : null;
  }

  #isMenuSide(value?: string): value is MenuSide {
    return value === 'top' || value === 'right' || value === 'bottom' || value === 'left';
  }

  #linkAnchor(): void {
    const anchor = this.#getAnchorElement();

    if (this.#activeAnchor === anchor) {
      return;
    }

    this.#unlinkAnchor();

    if (!anchor) {
      return;
    }

    this.#activeAnchor = anchor;
    anchor.addEventListener('keydown', this.#onAnchorKeydown);

    const computedAnchorName = getComputedStyle(anchor).anchorName;

    if (!computedAnchorName || computedAnchorName === 'none') {
      this.#generatedAnchorName ||= `--sl-menu-anchor-${nextUniqueId++}`;
      this.#previousInlineAnchorName = {
        value: anchor.style.getPropertyValue('anchor-name'),
        priority: anchor.style.getPropertyPriority('anchor-name')
      };
      anchor.style.anchorName = this.#generatedAnchorName;
    }

    this.style.positionAnchor = (anchor.style.anchorName || computedAnchorName)
      .split(',')[0]
      .trim();

    if (!this.hasAttribute('aria-details')) {
      anchor.setAttribute('aria-details', this.id);
    }
  }

  #updateAnchorState(expanded: boolean): void {
    const anchor = this.#activeAnchor;
    if (!anchor) {
      return;
    }

    anchor.setAttribute('aria-expanded', expanded.toString());

    if (anchor.tagName === 'SL-BUTTON') {
      anchor.toggleAttribute('popover-opened', expanded);
    }
  }

  #onBeforeToggle = (event: ToggleEvent): void => {
    const isOpening = event.newState === 'open';

    if (isOpening) {
      this.#linkAnchor();
    }
    this.#updateAnchorState(isOpening);

    const anchor = this.#activeAnchor;
    if (isOpening && anchor && this.#requiresJavaScriptPositioning(anchor)) {
      this.#startJavaScriptPositioning(anchor);
    } else {
      this.#stopJavaScriptPositioning();
    }
  };

  #onToggle = (event: ToggleEvent): void => {
    this.#stopSizing();

    if (event.newState !== 'open') {
      return;
    }

    if (this.hasAttribute('data-js-positioning')) {
      return;
    }

    this.#openController = new AbortController();

    const { signal } = this.#openController;

    document.addEventListener('scroll', this.#updateMaxSize, {
      capture: true,
      passive: true,
      signal
    });
    window.addEventListener('resize', this.#updateMaxSize, { passive: true, signal });

    const anchor = this.#getAnchorElement();
    if (anchor) {
      this.#resizeObserver = new ResizeObserver(this.#updateMaxSize);
      this.#resizeObserver.observe(anchor);
    }

    this.#updateMaxSize();
  };

  #onAnchorKeydown: EventListener = event => {
    if ((event as KeyboardEvent).key === 'Escape') {
      event.stopPropagation();
    }
  };

  #requiresJavaScriptPositioning(anchor: Element): boolean {
    const anchorRoot = anchor.getRootNode();
    let menuRoot = this.getRootNode();

    while (menuRoot !== anchorRoot) {
      if (!(menuRoot instanceof ShadowRoot)) {
        return true;
      }

      menuRoot = menuRoot.host.getRootNode();
    }

    return false;
  }

  #startJavaScriptPositioning(anchor: Element): void {
    this.#stopJavaScriptPositioning();
    this.#stopSizing();
    this.toggleAttribute('data-js-positioning', true);
    const previousActualPlacement = this.getAttribute('actual-placement'),
      previousStyles = javascriptPositionProperties.map(property => ({
        property,
        value: this.style.getPropertyValue(property),
        priority: this.style.getPropertyPriority(property)
      })),
      cleanup = positionPopover(this, anchor, {
        offset: this.offset ?? 6,
        position: this.position,
        viewportMargin
      });

    this.#positionCleanup = () => {
      cleanup();
      this.toggleAttribute('data-js-positioning', false);

      if (previousActualPlacement === null) {
        this.removeAttribute('actual-placement');
      } else {
        this.setAttribute('actual-placement', previousActualPlacement);
      }

      for (const { property, value, priority } of previousStyles) {
        if (value) {
          this.style.setProperty(property, value, priority);
        } else {
          this.style.removeProperty(property);
        }
      }
    };
  }

  #stopJavaScriptPositioning(): void {
    this.#positionCleanup?.();
    this.#positionCleanup = undefined;
  }

  #stopSizing(): void {
    this.#openController?.abort();
    this.#openController = undefined;
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
  }

  #updateMaxSize = (): void => {
    const anchor = this.#getAnchorElement();
    if (!anchor || !this.matches(':popover-open')) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect(),
      offset = this.offset ?? 6,
      [requestedSide, alignment] = (this.position ?? 'right-start').split('-') as [
        MenuSide,
        'start' | 'end' | undefined
      ],
      anchorCenterX = (anchorRect.left + anchorRect.right) / 2,
      anchorCenterY = (anchorRect.top + anchorRect.bottom) / 2,
      alignedBlockSize = Math.max(
        anchorRect.bottom - viewportMargin,
        window.innerHeight - anchorRect.top - viewportMargin
      ),
      alignedInlineSize = Math.max(
        anchorRect.right - viewportMargin,
        window.innerWidth - anchorRect.left - viewportMargin
      ),
      centeredBlockSize =
        2 *
        Math.min(
          anchorCenterY - viewportMargin,
          window.innerHeight - viewportMargin - anchorCenterY
        ),
      centeredInlineSize =
        2 *
        Math.min(
          anchorCenterX - viewportMargin,
          window.innerWidth - viewportMargin - anchorCenterX
        );

    let maxBlockSize = alignment ? alignedBlockSize : centeredBlockSize,
      maxInlineSize = alignment ? alignedInlineSize : centeredInlineSize;

    if (requestedSide === 'top' || requestedSide === 'bottom') {
      maxBlockSize =
        Math.max(anchorRect.top, window.innerHeight - anchorRect.bottom) - offset - viewportMargin;
    } else {
      maxInlineSize =
        Math.max(anchorRect.left, window.innerWidth - anchorRect.right) - offset - viewportMargin;
    }

    this.style.setProperty('--_menu-max-block-size', `${Math.max(minMenuSize, maxBlockSize)}px`);
    this.style.setProperty('--_menu-max-inline-size', `${Math.max(minMenuSize, maxInlineSize)}px`);
  };

  #unlinkAnchor(): void {
    if (!this.#activeAnchor) {
      return;
    }

    if (this.#activeAnchor.style.anchorName === this.#generatedAnchorName) {
      const previous = this.#previousInlineAnchorName;

      if (previous?.value) {
        this.#activeAnchor.style.setProperty('anchor-name', previous.value, previous.priority);
      } else {
        this.#activeAnchor.style.removeProperty('anchor-name');
      }
    }

    this.#previousInlineAnchorName = undefined;

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
