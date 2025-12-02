import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem, MenuItemGroup } from '@sl-design-system/menu';
import { RovingTabindexController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ToolBarDivider } from './tool-bar-divider.js';
import styles from './tool-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar': ToolBar;
  }
}

export interface ToolBarItemBase {
  element: HTMLElement;
  visible: boolean;
}

export interface ToolBarItemButton extends ToolBarItemBase {
  type: 'button';
  disabled?: boolean;
  icon?: string | null;
  label?: string | null;
  selectable?: boolean;

  click?(): void;
}

export interface ToolBarItemDivider extends ToolBarItemBase {
  type: 'divider';
}

export interface ToolBarItemGroup extends ToolBarItemBase {
  type: 'group';
  buttons: ToolBarItemButton[];
  label?: string | null;
  selects?: 'single' | 'multiple';
}

export interface ToolBarItemMenu extends ToolBarItemBase {
  type: 'menu';
  disabled?: boolean;
  icon?: string | null;
  label?: string | null;
  menuItems: Array<ToolBarItemButton | ToolBarItemDivider | ToolBarItemMenu>;
}

export type ToolBarItem = ToolBarItemButton | ToolBarItemDivider | ToolBarItemGroup | ToolBarItemMenu;

/**
 * A responsive container that automatically hides items in an overflow menu when space is limited.
 *
 * @csspart wrapper - The wrapper element that contains the tool bar items.
 *
 * @slot - The tool bar items.
 */
@localized()
export class ToolBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-menu': Menu,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
      'sl-menu-item-group': MenuItemGroup
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Most recent available width (in pixels) used to detect significant size changes and avoid flickering. */
  #lastAvailableWidth = 0;

  /** Default and fallback cache for the menu button size (pixels).
   * Used when actual size is unavailable.
   * - menu button width/height: 36px, icon-only block-size + border-width in button.scss
   * - gap: 8px, gap: var(--sl-size-100) in tool-bar.scss
   * */
  #menuButtonSizeCache = 44; // menu button + gap

  /** Cached measured width (in pixels) of the overflow/menu button. */
  #menuButtonSize?: number;

  /** Observe changes to the child elements. */
  #mutationObserver = new MutationObserver(() => this.#updateMapping());

  /** Flag indicating whether item width measurements are required before recalculating layout. */
  #needsMeasurement = true;

  /** Observe changes to the size of the host element. */
  #resizeObserver = new ResizeObserver(() => this.#onResize());

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<HTMLElement>(this, {
    direction: 'horizontal',
    focusInIndex: (elements: HTMLElement[]) => elements.findIndex(el => !el.hasAttribute('disabled')),
    elements: () => (this.items || []).map(item => item.element),
    isFocusableElement: (el: HTMLElement) => {
      if (el instanceof ToolBarDivider) {
        return false;
      }

      return !el.hasAttribute('disabled');
    }
  });

  /**
   * Cached total width (in pixels) of all toolbar items including gaps.
   * Used to decide when items overflow into the menu.
   */
  #totalWidth: number = 0;

  /**
   * Cached measured widths (in pixels) for each tool-bar item.
   * Used to determine item visibility.
   */
  #widths: number[] = [];

  /**
   * The horizontal alignment within the tool-bar.
   * @default 'start'
   */
  @property({ reflect: true }) align?: 'start' | 'end';

  /** @internal The version of a tool-bar with spacing around. */
  @property({ type: Boolean, reflect: true }) contained?: boolean;

  /**
   * If true, the tool-bar is disabled and cannot be interacted with.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal True when the tool-bar is empty. */
  @property({ type: Boolean, reflect: true }) empty?: boolean;

  /**
   * The type of buttons and menu buttons (also overflow menu button).
   * @default 'outline'
   */
  @property() type?: Extract<ButtonFill, 'ghost' | 'outline'>;

  /** @internal The tool bar items. */
  @state() items: ToolBarItem[] = [];

  /** @internal The tool bar items that should be shown in the overflow menu. */
  @state() menuItems: ToolBarItem[] = [];

  /** Use this if you want the menu button to use the "inverted" variant. */
  @property({ type: Boolean }) inverted?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'toolbar');

    this.#mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-disabled', 'disabled']
    });
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('disabled')) {
      const children = this.renderRoot.querySelector('slot')?.assignedElements({ flatten: true }) ?? [];

      if (this.disabled) {
        children.forEach(el => el.setAttribute('disabled', ''));
      } else {
        children.forEach(el => el.removeAttribute('disabled'));
      }
    }

    if (changes.has('items')) {
      this.menuItems = this.items.filter(item => !item.visible);
    }

    // When `type` changes, update fill of assigned sl-button / sl-menu-button elements.
    if (changes.has('type')) {
      const slot = this.renderRoot.querySelector('slot');
      const assigned = slot?.assignedElements({ flatten: true }) ?? [];

      assigned.forEach(el => {
        const targets: Element[] = [];

        if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') targets.push(el);
        targets.push(...Array.from(el.querySelectorAll('sl-button, sl-menu-button')));

        targets.forEach(btn => {
          if (typeof this.type === 'string' && this.type.length) {
            btn.setAttribute('fill', this.type);
          }
        });
      });
    }

    // When `inverted` changes, set inverted on sl-button / sl-menu-button elements.
    if (changes.has('inverted')) {
      const slot = this.renderRoot.querySelector('slot');
      const assigned = slot?.assignedElements({ flatten: true }) ?? [];

      assigned.forEach(el => {
        const targets: Element[] = [];

        if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') targets.push(el);
        targets.push(...Array.from(el.querySelectorAll('sl-button, sl-menu-button')));

        targets.forEach(btn => {
          if (this.inverted) {
            btn.setAttribute('variant', 'inverted');
          } else {
            btn.removeAttribute('variant');
          }
        });
      });
    }
  }

  override firstUpdated(): void {
    requestAnimationFrame(() => {
      const wrapper = this.renderRoot.querySelector('[part="wrapper"]');

      if (wrapper) {
        this.#measureItems(wrapper);
      }

      // Observe the host element for size changes
      // The host is what has flex constraints from parent containers
      this.#resizeObserver.observe(this);

      this.#rovingTabindexController.clearElementCache();
    });
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>

      ${this.menuItems.length
        ? html`
            <sl-menu-button
              aria-label=${msg('Show more', { id: 'sl.toolBar.showMore' })}
              fill=${ifDefined(this.type)}
              variant=${ifDefined(this.inverted ? 'inverted' : undefined)}
            >
              <sl-icon name="ellipsis-vertical" slot="button"></sl-icon>
              ${this.menuItems.map(item => this.renderMenuItem(item))}
            </sl-menu-button>
          `
        : nothing}
    `;
  }

  override focus(): void {
    this.#rovingTabindexController.focus();
  }

  /** @internal */
  renderMenuItem(item: ToolBarItem): TemplateResult {
    if (item.type === 'group') {
      return html`
        <sl-menu-item-group .heading=${item.label ?? ''} .selects=${item.selects}>
          ${item.buttons.map(button => this.renderMenuItem(button))}
        </sl-menu-item-group>
      `;
    } else if (item.type === 'divider') {
      return html`<hr />`;
    } else if (item.type === 'button') {
      return html`
        <sl-menu-item @click=${() => item.click?.()} ?disabled=${item.disabled} ?selectable=${item.selectable}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
        </sl-menu-item>
      `;
    } else {
      return html`
        <sl-menu-item ?disabled=${item.disabled}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
          <sl-menu slot="submenu">${item.menuItems.map(menuItem => this.renderMenuItem(menuItem))}</sl-menu>
        </sl-menu-item>
      `;
    }
  }

  /**
   * Manually trigger an update of the tool-bar layout. Tool-bar tries to automatically
   * detect changes to its size and child elements, but in some cases you may need to
   * call this method manually (for example when a nested slot is present: the `slotchange`
   * event or the `MutationObserver` will not fire in the case of a nested slot).
   */
  refresh(): void {
    this.#updateMapping();
  }

  #onResize(): void {
    // Use element's current width to avoid inconsistent ResizeObserver entry shapes.
    const availableWidth = this.#getAvailableWidth();

    if (!availableWidth) {
      return;
    }

    const wrapper = this.renderRoot.querySelector('[part="wrapper"]');

    if (!wrapper) {
      return;
    }

    const gap = parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0;

    // If available width has changed significantly, re-measure to get accurate item widths
    // This is important when items were hidden and now there's more space, or when parent constraints change
    const widthChanged = Math.abs(availableWidth - this.#lastAvailableWidth) > 5; // 5px threshold to avoid jitter

    if (this.#needsMeasurement || !this.#totalWidth || !this.#widths.length || widthChanged) {
      this.#measureItems(wrapper);
    }

    this.#lastAvailableWidth = availableWidth;

    if (!this.#totalWidth || !this.#widths.length) {
      return;
    }

    // First pass: calculate visibility assuming no menu button
    let acc = 0;
    for (let i = 0; i < this.items.length; i++) {
      acc += this.#widths[i];
      this.items[i].visible = acc <= availableWidth;
      if (i < this.items.length - 1) acc += gap;
    }

    // Check if we need the overflow menu
    const allVisible = this.items.every(item => item.visible);

    if (!allVisible) {
      // Second pass: recalculate with space reserved for menu button
      let buttonSize = this.#menuButtonSize ?? this.#menuButtonSizeCache;
      const wrapperHeight = Math.round(wrapper.getBoundingClientRect().height);

      if (this.#menuButtonSize == null && wrapperHeight > 0) {
        this.#menuButtonSizeCache = wrapperHeight;
        buttonSize = wrapperHeight;
      }

      const effectiveAvailable = availableWidth - buttonSize - gap;
      acc = 0;

      for (let i = 0; i < this.items.length; i++) {
        acc += this.#widths[i];
        this.items[i].visible = acc <= effectiveAvailable;
        if (i < this.items.length - 1) acc += gap;
      }
    }

    // Apply DOM changes in one pass
    this.items.forEach(item => {
      item.element.style.display = item.visible ? '' : 'none';
    });

    this.menuItems = this.items.filter(item => !item.visible);

    // Check if all items are hidden and update menu button class
    const allHidden = this.items.every(item => !item.visible);
    requestAnimationFrame(() => {
      const menuButton = this.renderRoot.querySelector('sl-menu-button');
      menuButton?.classList.toggle('all-hidden', allHidden);
    });

    this.requestUpdate('items');
  }

  #getAvailableWidth(): number {
    // The host element's bounding box width reflects all CSS constraints
    // including flex containers, max-inline-size, and parent constraints
    const hostWidth = this.getBoundingClientRect().width;

    // Account for any padding on the host element
    const hostStyles = getComputedStyle(this);
    const hostPadding = parseFloat(hostStyles.paddingLeft || '0') + parseFloat(hostStyles.paddingRight || '0');

    const availableWidth = hostWidth - hostPadding;

    return availableWidth;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }) {
    // Ignore events from nested slots.
    if (event.target !== this.renderRoot.querySelector('slot')) {
      return;
    }

    const assigned = event.target.assignedElements({ flatten: true });

    if (typeof this.disabled === 'boolean') {
      event.target.assignedElements({ flatten: true }).forEach(el => el.toggleAttribute('disabled', this.disabled));
    }

    // set for each sl-button and sl-menu-button inside the slot the fill to this.type
    assigned.forEach(el => {
      const targets: Element[] = [];

      // include direct sl-button and sl-menu-button elements
      if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') targets.push(el);

      // include any nested sl-button and sl-menu-button elements
      targets.push(...Array.from(el.querySelectorAll('sl-button, sl-menu-button')));

      targets.forEach(btn => {
        if (this.type) {
          btn.setAttribute('fill', this.type);
        }
      });
    });

    requestAnimationFrame(() => {
      this.#updateMapping();
    });
  }

  #updateMapping(): void {
    const slot = this.renderRoot.querySelector('slot')!,
      elements = slot.assignedElements({ flatten: true });

    this.empty = elements.length === 0;

    this.items = elements
      .map(element => {
        if (element instanceof Button) {
          return this.#mapButtonToItem(element);
        } else if (element instanceof MenuButton) {
          return this.#mapMenuButtonToItem(element);
        } else if (element instanceof ToolBarDivider) {
          return { element, type: 'divider' };
        } else if (!['SL-TOOLTIP'].includes(element.tagName)) {
          console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar.`);
        }

        return undefined;
      })
      .filter(item => item !== undefined) as ToolBarItem[];

    this.#needsMeasurement = true;

    // Reconnect the resize observer to the host
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this);
  }

  #measureItems(wrapper: Element): void {
    if (this.offsetParent === null) {
      this.#needsMeasurement = true;

      return;
    }

    const gap = parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0;

    // Temporarily show all items to get accurate measurements
    const previousDisplayValues: string[] = [];
    this.items.forEach((item, i) => {
      previousDisplayValues[i] = item.element.style.display;
      item.element.style.display = '';
    });

    this.#widths = this.items.map(item => item.element.getBoundingClientRect().width);
    this.#totalWidth = this.#widths.reduce((sum, w, i) => sum + w + (i < this.#widths.length - 1 ? gap : 0), 0);

    // Restore previous display values
    this.items.forEach((item, i) => {
      item.element.style.display = previousDisplayValues[i];
    });

    this.#needsMeasurement = false;
  }

  #mapButtonToItem(button: HTMLElement): ToolBarItemButton {
    let label: string | undefined = button.getAttribute('aria-label') || button.textContent?.trim();

    if (button.hasAttribute('aria-labelledby')) {
      const buttonLabelledby = button.getAttribute('aria-labelledby');

      if (this.querySelector(`#${buttonLabelledby}`)) {
        label = this.querySelector(`#${buttonLabelledby}`)?.textContent?.trim();
      } else if (
        button.nextElementSibling &&
        button.nextElementSibling.tagName === 'SL-TOOLTIP' &&
        buttonLabelledby === button.nextElementSibling.id
      ) {
        label = button.nextElementSibling.textContent?.trim();
      }
    } else if (!label && button.hasAttribute('aria-describedby')) {
      label = this.querySelector(`#${button.getAttribute('aria-describedby')}`)?.textContent?.trim();
    }

    return {
      element: button,
      type: 'button',
      disabled: button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true',
      icon: button.querySelector('sl-icon')?.getAttribute('name'),
      label,
      selectable: button.hasAttribute('aria-pressed'),
      visible: true,
      click: () => button.click()
    };
  }

  #mapMenuButtonToItem(menuButton: MenuButton): ToolBarItemMenu {
    let label: string | undefined =
      menuButton.renderRoot.querySelector('sl-button')?.getAttribute('aria-label') ||
      menuButton.querySelector('[slot="button"]')?.textContent?.trim();

    if (menuButton.hasAttribute('aria-labelledby')) {
      const buttonLabelledby = menuButton.getAttribute('aria-labelledby');

      if (this.querySelector(`#${buttonLabelledby}`)) {
        label = this.querySelector(`#${buttonLabelledby}`)?.textContent?.trim();
      } else if (
        menuButton.nextElementSibling &&
        menuButton.nextElementSibling.tagName === 'SL-TOOLTIP' &&
        buttonLabelledby === menuButton.nextElementSibling.id
      ) {
        label = menuButton.nextElementSibling.textContent?.trim();
      }
    } else if (!label && menuButton.hasAttribute('aria-describedby')) {
      label = this.querySelector(`#${menuButton.getAttribute('aria-describedby')}`)?.textContent?.trim();
    }

    const menuItems = Array.from(menuButton.querySelectorAll('sl-menu-item')).map(el => this.#mapButtonToItem(el));

    return {
      element: menuButton,
      type: 'menu',
      disabled: menuButton.hasAttribute('disabled') || menuButton.getAttribute('aria-disabled') === 'true',
      icon: menuButton.querySelector('sl-icon')?.getAttribute('name'),
      label,
      menuItems,
      visible: true
    };
  }
}
