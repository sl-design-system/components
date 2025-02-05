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
import { property, query, state } from 'lit/decorators.js';
import styles from './menu-item.scss.js';
import { Menu } from './menu.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-item': MenuItem;
  }
}

export type MenuItemVariant = 'default' | 'danger';

/**
 * Menu item component for use inside a menu.
 *
 * @csspart wrapper - The wrapper around the menu item content.
 *
 * @slot default - Content to display inside the menu item.
 * @slot submenu - The menu items that will be displayed when the menu item is shown.
 */
export class MenuItem extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal The default offset of the submenu to the menu item. */
  static submenuOffset = 0;

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown,
    pointerenter: this.#onPointerenter,
    pointerleave: this.#onPointerleave
  });

  /** Shortcut controller. */
  #shortcut = new ShortcutController(this);

  /** Whether this menu item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal Emits the current selected state as a boolean when the user toggles the menu item. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent>;

  /** Whether this menu item has been selected. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  /** Whether this menu item can be selected. */
  @property({ type: Boolean }) selectable?: boolean;

  /** Keyboard shortcut for activating this menu item. */
  @property() shortcut?: string;

  /** @internal The sub menu, if present. */
  @state() submenu?: Menu;

  /** @internal The sub menu, if present. */
  @query('[part="wrapper"]') wrapper?: HTMLElement;

  /** The variant of the menu item. */
  @property({ reflect: true }) variant?: MenuItemVariant;

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

    if (changes.has('selectable')) {
      const selectMode = this.parentElement?.matches('[selects="single"]') ? 'menuitemradio' : 'menuitemcheckbox';
      this.role = this.selectable ? selectMode : 'menuitem';
    }
    if (changes.has('selected')) {
      this.setAttribute('aria-checked', (this.selected || false).toString());
    }
  }

  override render(): TemplateResult {
    return html`
      <div @pointermove=${this.#onPointermove} class="container">
        <div aria-hidden="true" class="safe-triangle"></div>
        <div part="wrapper">
          ${this.selected ? html`<sl-icon name="check"></sl-icon>` : nothing}
          <slot></slot>
          ${this.shortcut ? html`<kbd>${this.#shortcut.render(this.shortcut)}</kbd>` : nothing}
          ${this.submenu ? html`<sl-icon name="chevron-right"></sl-icon>` : nothing}
        </div>
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
    if (this.submenu && isPopoverOpen(this.submenu)) {
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
      this.wrapper?.setAttribute('aria-haspopup', 'true');
      this.wrapper?.setAttribute('aria-controls', this.submenu.id);
    }
  }

  #showSubMenu(focus?: boolean): void {
    if (!this.submenu) {
      return;
    }

    this.submenu?.showPopover();
    this.setAttribute('aria-expanded', 'true');

    if (focus) {
      this.submenu?.focus();
    }
  }

  #hideSubMenu(): void {
    if (!this.submenu) {
      return;
    }
    this.submenu?.hidePopover();
    this.setAttribute('aria-expanded', 'false');
  }

  /**
   * Calculate a "safe triangle" for the submenu to a user can safely move his cursor
   * from the trigger to the submenu without the submenu closing.
   * See https://www.smashingmagazine.com/2023/08/better-context-menus-safe-triangles
   */
  #calculateSafeTriangle(event: PointerEvent): void {
    const actualPlacement = this.submenu?.getAttribute('actual-placement');

    if (!actualPlacement || !this.submenu) {
      return;
    }

    const rect = this.getBoundingClientRect(),
      submenuRect = this.submenu.getBoundingClientRect(),
      insetBlockStart = Math.floor(Math.min(rect.top, submenuRect.top)),
      blockSize = Math.ceil(Math.max(rect.bottom, submenuRect.bottom) - insetBlockStart);

    let inlineSize = 0,
      inset = '',
      polygon = '';
    if (actualPlacement.startsWith('right')) {
      const insetInlineStart = Math.floor(rect.left);

      inlineSize = Math.floor(submenuRect.left - rect.left);
      inset = `${insetBlockStart}px auto auto ${insetInlineStart}px`;
      polygon = `${event.clientX - insetInlineStart}px ${event.clientY - insetBlockStart}px, 100% 0, 100% 100%`;
    } else if (actualPlacement.startsWith('left')) {
      const insetInlineStart = Math.floor(submenuRect.right);

      inlineSize = Math.floor(rect.right - submenuRect.right);
      inset = `${insetBlockStart}px auto auto ${insetInlineStart}px`;
      polygon = `${event.clientX - insetInlineStart}px ${event.clientY - insetBlockStart}px, 0 100%, 0 0`;
    } else {
      console.warn('Unsupported submenu placement: ', actualPlacement);
      return;
    }

    const safeTriangle = this.renderRoot.querySelector<HTMLElement>('.safe-triangle')!;
    safeTriangle.style.blockSize = `${blockSize}px`;
    safeTriangle.style.clipPath = `polygon(${polygon})`;
    safeTriangle.style.inlineSize = `${inlineSize}px`;
    safeTriangle.style.inset = inset;
  }
}
