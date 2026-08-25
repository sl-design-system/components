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
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import {
  EventsController,
  ShortcutController,
  event,
  isPopoverOpen
} from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './menu-item.scss.js';
import { Menu } from './menu.js';
const _MenuItem = class _MenuItem extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon
    };
  }
  static {
    /** @internal The default offset of the submenu to the menu item. */
    this.submenuOffset = 0;
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown,
    pointerenter: this.#onPointerenter,
    pointerleave: this.#onPointerleave
  });
  /** Shortcut controller. */
  #shortcut = new ShortcutController(this);
  // Tracks whether aria-disabled was added internally so explicit user-provided values survive.
  #ariaDisabledFromDisabled = false;
  get #disabled() {
    return this.disabled || this.ariaDisabled === 'true';
  }
  connectedCallback() {
    super.connectedCallback();
    this.role = 'menuitem';
    this.setAttribute('tabindex', '0');
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('disabled')) {
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
      if (this.disabled) {
        if (this.ariaDisabled !== 'true') {
          this.setAttribute('aria-disabled', 'true');
          this.#ariaDisabledFromDisabled = true;
        }
      } else if (this.#ariaDisabledFromDisabled) {
        this.removeAttribute('aria-disabled');
        this.#ariaDisabledFromDisabled = false;
      }
    }
    if (changes.has('shortcut')) {
      if (this.shortcut) {
        this.setAttribute('aria-keyshortcuts', this.#shortcut.renderAsText(this.shortcut));
        this.#shortcut.bind({ [this.shortcut]: this.#onShortcut.bind(this) });
      } else {
        this.removeAttribute('aria-keyshortcuts');
        this.#shortcut.unbind();
      }
    }
    if (changes.has('selectable')) {
      const selectMode = this.parentElement?.matches('[selects="single"]')
        ? 'menuitemradio'
        : 'menuitemcheckbox';
      this.role = this.selectable ? selectMode : 'menuitem';
    }
    if (changes.has('selectable') || changes.has('selected')) {
      if (this.selectable) {
        this.setAttribute('aria-checked', (this.selected || false).toString());
      } else {
        this.removeAttribute('aria-checked');
      }
    }
    if (changes.has('submenu')) {
      if (this.submenu) {
        this.setAttribute('aria-expanded', this.submenu?.matches(':popover-open').toString());
        this.wrapper?.setAttribute('aria-haspopup', 'true');
        this.wrapper?.setAttribute('aria-controls', this.submenu.id);
      } else {
        this.removeAttribute('aria-expanded');
        this.wrapper?.removeAttribute('aria-haspopup');
        this.wrapper?.removeAttribute('aria-controls');
      }
    }
  }
  render() {
    return html`
      <div @pointermove=${this.#onPointermove} class="container">
        <div aria-hidden="true" class="safe-triangle"></div>
        <div part="wrapper">
          ${this.selectable && this.selected ? html`<sl-icon name="check"></sl-icon>` : nothing}
          <slot></slot>
          ${this.shortcut ? html`<kbd aria-hidden="true">${this.#shortcut.renderAsLabel(this.shortcut)}</kbd>` : nothing}
          ${this.submenu ? html`<sl-icon name="chevron-right"></sl-icon>` : nothing}
        </div>
      </div>
      <slot @slotchange=${this.#onSubmenuChange} name="submenu"></slot>
    `;
  }
  #onClick(event2) {
    if (this.submenu && event2.composedPath().includes(this.submenu)) {
      return;
    }
    if (this.#disabled) {
      event2.preventDefault();
      event2.stopPropagation();
      return;
    }
    if (this.submenu) {
      event2.preventDefault();
      event2.stopPropagation();
      setTimeout(() => this.#showSubMenu(), 100);
    } else if (this.selectable) {
      const selectModeSingle = this.parentElement?.matches('[selects="single"]');
      if (!selectModeSingle || (selectModeSingle && !this.selected)) {
        this.selected = !this.selected;
        this.selectEvent.emit(this.selected);
      }
    }
  }
  #onKeydown(event2) {
    if (this.#disabled) {
      return;
    }
    if (event2.key === 'Enter' || event2.key === ' ') {
      event2.preventDefault();
      event2.stopPropagation();
      if (this.submenu) {
        this.#showSubMenu(true);
      } else {
        this.click();
      }
    } else if (event2.key === 'ArrowRight' && this.submenu) {
      event2.preventDefault();
      event2.stopPropagation();
      this.#showSubMenu(true);
    }
  }
  #onPointerenter() {
    if (this.#disabled) {
      return;
    }
    this.#showSubMenu();
  }
  #onPointerleave() {
    this.#hideSubMenu();
  }
  #onPointermove(event2) {
    if (this.submenu && isPopoverOpen(this.submenu)) {
      this.#calculateSafeTriangle(event2);
    }
  }
  #onShortcut(event2) {
    if (this.#disabled) {
      return;
    }
    event2.preventDefault();
    event2.stopPropagation();
    this.click();
  }
  #onSubmenuChange(event2) {
    this.submenu = event2.target
      .assignedElements({ flatten: true })
      .find(node => node instanceof Menu);
    if (this.submenu) {
      this.submenu.anchorElement = this;
      this.submenu.offset = _MenuItem.submenuOffset;
      this.submenu.addEventListener('beforetoggle', () => {
        this.setAttribute('aria-expanded', (!this.submenu?.matches(':popover-open')).toString());
      });
    }
  }
  #showSubMenu(focus) {
    if (!this.submenu) {
      return;
    }
    this.submenu?.showPopover();
    if (focus) {
      this.submenu?.focus();
    }
  }
  #hideSubMenu() {
    if (!this.submenu) {
      return;
    }
    this.submenu?.hidePopover();
  }
  /**
   * Calculate a "safe triangle" for the submenu to a user can safely move his cursor from the
   * trigger to the submenu without the submenu closing. See
   * https://www.smashingmagazine.com/2023/08/better-context-menus-safe-triangles
   */
  #calculateSafeTriangle(event2) {
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
      polygon = `${event2.clientX - insetInlineStart}px ${event2.clientY - insetBlockStart}px, 100% 0, 100% 100%`;
    } else if (actualPlacement.startsWith('left')) {
      const insetInlineStart = Math.floor(submenuRect.right);
      inlineSize = Math.floor(rect.right - submenuRect.right);
      inset = `${insetBlockStart}px auto auto ${insetInlineStart}px`;
      polygon = `${event2.clientX - insetInlineStart}px ${event2.clientY - insetBlockStart}px, 0 100%, 0 0`;
    } else {
      console.warn('Unsupported submenu placement: ', actualPlacement);
      return;
    }
    const safeTriangle = this.renderRoot.querySelector('.safe-triangle');
    safeTriangle.style.blockSize = `${blockSize}px`;
    safeTriangle.style.clipPath = `polygon(${polygon})`;
    safeTriangle.style.inlineSize = `${inlineSize}px`;
    safeTriangle.style.inset = inset;
  }
};
__decorateClass([property({ type: Boolean, reflect: true })], _MenuItem.prototype, 'disabled', 2);
__decorateClass([event({ name: 'sl-select' })], _MenuItem.prototype, 'selectEvent', 2);
__decorateClass([property({ type: Boolean, reflect: true })], _MenuItem.prototype, 'selected', 2);
__decorateClass([property({ type: Boolean })], _MenuItem.prototype, 'selectable', 2);
__decorateClass([property()], _MenuItem.prototype, 'shortcut', 2);
__decorateClass([state()], _MenuItem.prototype, 'submenu', 2);
__decorateClass([property({ reflect: true })], _MenuItem.prototype, 'emphasis', 2);
__decorateClass([query('[part="wrapper"]')], _MenuItem.prototype, 'wrapper', 2);
__decorateClass([property({ reflect: true })], _MenuItem.prototype, 'variant', 2);
export let MenuItem = _MenuItem;
//# sourceMappingURL=menu-item.js.map
