import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  EventsController,
  ShortcutController,
  event,
  isPopoverOpen
} from '@sl-design-system/shared';
import { SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './menu-item.scss.js';
import { Menu } from './menu.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-item': MenuItem;
  }
}

/**
 * Menu item component for use inside a menu.
 *
 * @csspart wrapper - The wrapper around the menu item content.
 *
 * @slot default - Content to display inside the menu item.
 * @slot submenu - The menu items that will be displayed when the menu item is shown.
 */
export class MenuItem extends ScopedElementsMixin(LitElement) {
  /** The default offset of the submenu to the menu item. */
  static submenuOffset = 0;

  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown,
    pointerenter: this.#onPointerenter,
    pointerleave: this.#onPointerleave,
    pointermove: this.#onPointermove
  });

  /** Shortcut controller. */
  #shortcut = new ShortcutController(this);

  /** Whether this menu item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Emits when the user toggles the selected state. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent>;

  /** Whether this menu item has been selected. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  /** Whether this menu item can be selected. */
  @property({ type: Boolean }) selectable?: boolean;

  /** Keyboard shortcut for activating this menu item. */
  @property() shortcut?: string;

  /** The sub menu, if present. */
  @state() submenu?: Menu;

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'menuitem';
    this.setAttribute('tabindex', '0');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }

    if (changes.has('shortcut')) {
      if (this.shortcut) {
        this.#shortcut.bind({ [this.shortcut]: this.#onShortcut.bind(this) });
      } else {
        this.#shortcut.unbind();
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <div aria-hidden="true" class="safe-triangle"></div>
      <div part="wrapper">
        ${this.selected ? html`<sl-icon name="check"></sl-icon>` : nothing}
        <slot></slot>
        ${this.shortcut ? html`<kbd>${this.#shortcut.render(this.shortcut)}</kbd>` : nothing}
        ${this.submenu ? html`<sl-icon name="chevron-right"></sl-icon>` : nothing}
      </div>
      <slot @slotchange=${this.#onSubmenuChange} name="submenu"></slot>
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    if (this.submenu) {
      event.preventDefault();
      event.stopPropagation();

      /**
       * At the moment, we cannot prevent the submenu from closing when clicking
       * on this menu item. In the future when `beforetoggle` has a `relatedTarget`
       * attribute, we can detect if the user clicks on this menuitem and prevent
       * the submenu from closing.
       *
       * We need to delay the submenu opening because it may also be closing at
       * this time.
       */
      setTimeout(() => this.#showSubMenu(), 100);
    } else if (this.selectable) {
      this.selected = !this.selected;
      this.selectEvent.emit(this.selected);
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();

      if (this.submenu) {
        this.#showSubMenu(true);
      } else {
        this.click();
      }
    } else if (event.key === 'ArrowRight' && this.submenu) {
      event.preventDefault();
      event.stopPropagation();

      this.#showSubMenu(true);
    }
  }

  #onPointerenter(): void {
    this.#showSubMenu();
  }

  #onPointerleave(): void {
    this.#hideSubMenu();
  }

  #onPointermove(event: PointerEvent): void {
    if (isPopoverOpen(this.submenu)) {
      this.#calculateSafeTriangle(event);
    }
  }

  #onShortcut(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.click();
  }

  #onSubmenuChange(event: Event & { target: HTMLSlotElement }): void {
    this.submenu = event.target.assignedElements({ flatten: true }).find((node): node is Menu => node instanceof Menu);

    if (this.submenu) {
      this.submenu.anchorElement = this;
      this.submenu.offset = MenuItem.submenuOffset;
    }
  }

  #showSubMenu(focus?: boolean): void {
    if (!this.submenu) {
      return;
    }

    this.submenu?.showPopover();

    if (focus) {
      this.submenu?.focus();
    }
  }

  #hideSubMenu(): void {
    this.submenu?.hidePopover();
  }

  /**
   * Calculate a "safe triangle" for the submenu to a user can safely move his cursor
   * from the trigger to the submenu without the submenu closing.
   * See https://www.smashingmagazine.com/2023/08/better-context-menus-safe-triangles
   */
  #calculateSafeTriangle(event: PointerEvent): void {
    const actualPlacement = this.submenu?.getAttribute('actual-placement'),
      parentMenu = this.closest('sl-menu') || this.assignedSlot?.closest('sl-menu');

    if (!actualPlacement || !parentMenu || !this.submenu) {
      return;
    }

    const parentRect = parentMenu?.getBoundingClientRect(),
      rect = this.getBoundingClientRect(),
      submenuRect = this.submenu.getBoundingClientRect();

    // Top, right, bottom, left
    const inset = [
      Math.floor(Math.min(rect.top, submenuRect.top) - parentRect.top),
      0,
      Math.ceil(parentRect.bottom - Math.max(rect.bottom, submenuRect.bottom)),
      0
    ];

    let polygon = '';
    if (actualPlacement.startsWith('right')) {
      inset[1] = Math.floor(parentRect.right - submenuRect.left);
      inset[3] = Math.floor(rect.left - parentRect.left);

      polygon = `${event.clientX - rect.left}px ${event.clientY - submenuRect.top}px, 100% 0, 100% 100%`;
    } else if (actualPlacement.startsWith('left')) {
      inset[1] = Math.floor(parentRect.right - rect.right);
      inset[3] = Math.floor(submenuRect.right - parentRect.left);

      polygon = `${event.clientX - rect.left}px ${event.clientY - submenuRect.top}px, 0 100%, 0 0`;
    } else {
      console.warn('Unsupported submenu placement: ', actualPlacement);
      return;
    }

    ['block-start', 'inline-end', 'block-end', 'inline-start'].forEach((side, i) => {
      this.style.setProperty(`--_safe-triangle-inset-${side}`, `${inset[i]}px`);
    });
    this.style.setProperty('--_safe-triangle-polygon', polygon);
  }
}
