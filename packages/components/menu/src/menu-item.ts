import { faCheck, faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  EventsController,
  ShortcutController,
  event,
  isPopoverOpen
} from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { Menu } from './menu.js';
import styles from './menu-item.scss.js';

Icon.register(faCheck, faChevronRight);

/**
 * Menu item component for use inside a menu.
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

  /**
   * A CSS clip-path polygon indicating a triangle between the menu and its trigger,
   * also called a "safe triangle". This is used to prevent the menu from closing
   * when the user moves the cursor from the trigger to the menu.
   * See https://www.smashingmagazine.com/2023/08/better-context-menus-safe-triangles
   */
  @state() safeTriangleClipPath?: string;

  /** The inset for the safe triangle element, relative to it's parent menu. */
  @state() safeTriangleInset?: number[];

  /** Whether this menu item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Emits when the user toggles the selected state. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<boolean>;

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
      <div class="wrapper">
        ${this.selected ? html`<sl-icon name="far-check"></sl-icon>` : nothing}
        <slot></slot>
        ${this.shortcut ? html`<kbd>${this.#shortcut.render(this.shortcut)}</kbd>` : nothing}
        ${this.submenu ? html`<sl-icon name="far-chevron-right"></sl-icon>` : nothing}
      </div>
      <div class="submenu">
        <slot @slotchange=${this.#onSubmenuChange} name="submenu"></slot>
      </div>
      ${this.safeTriangleInset && this.safeTriangleClipPath
        ? html`
            <div
              aria-hidden="true"
              class="safe-triangle"
              style=${styleMap({
                clipPath: `polygon(${this.safeTriangleClipPath})`,
                inset: this.safeTriangleInset.map(v => `${v}px`).join(' ')
              })}
            ></div>
          `
        : nothing}
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();

      return;
    }

    if (this.submenu) {
      this.#showSubMenu();
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
    this.safeTriangleInset = this.safeTriangleClipPath = undefined;
  }

  #calculateSafeTriangle(event: PointerEvent): void {
    const actualPlacement = this.submenu?.getAttribute('actual-placement'),
      parentMenu = this.closest('sl-menu') || this.assignedSlot?.closest('sl-menu');

    if (!actualPlacement || !parentMenu || !this.submenu) {
      return undefined;
    }

    const { clientX, clientY } = event,
      parentRect = parentMenu?.getBoundingClientRect(),
      rect = this.getBoundingClientRect(),
      submenuRect = this.submenu.getBoundingClientRect();

    let inset: number[] | undefined,
      clipPath = '';
    if (actualPlacement.startsWith('right')) {
      inset = [
        Math.min(rect.top, submenuRect.top),
        submenuRect.left,
        Math.max(rect.bottom, submenuRect.bottom),
        rect.left
      ];
      clipPath = `${clientX - inset[3]}px ${clientY - inset[0]}px, 100% 0, 100% 100%`;
    } else if (actualPlacement.startsWith('left')) {
      inset = [
        Math.min(rect.top, submenuRect.top),
        rect.right,
        Math.max(rect.bottom, submenuRect.bottom),
        submenuRect.right
      ];
      clipPath = `${clientX - inset[3]}px ${clientY - inset[0]}px, 0 100%, 0 0`;
    } else {
      console.log('Unsupported placement: ', actualPlacement);
      inset = [0, 0, 0, 0];
    }

    // Calculate the inset relative to the parent menu
    inset = [
      inset[0] - parentRect.top,
      parentRect.right - inset[1],
      parentRect.bottom - inset[2],
      inset[3] - parentRect.left
    ];

    this.safeTriangleClipPath = clipPath;
    this.safeTriangleInset = inset;
  }
}
