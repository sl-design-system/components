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
 * By default, the tool bar doesn't have a border or padding around it; it's useful when embedding
 * the tool bar inside another component. Please make sure there is enough
 * space around the tool bar to show focus outlines.
 * If you want a tool-bar with spacing, use the `contained` attribute.
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

  /** Observe changes to the child elements. */
  #mutationObserver = new MutationObserver(() => this.#updateMapping());

  /** Flag indicating whether item width measurements are required before recalculating layout. */
  #needsMeasurement = true;

  /** Observe changes to the size of the host element. */
  #resizeObserver = new ResizeObserver(entries => {
    // This is called when the tool bar size changes. When the tool bar is flexible,
    // its size changes as buttons are hidden, which can cause an infinite loop that
    // only stops when all hideable buttons are hidden. We stop that loop when the
    // actual vertical overflow is gone.
    const entry = entries.at(0);

    if (!entry) {
      return;
    }

    const contentBox = entry.contentBoxSize?.at(0);
    if (!contentBox) return;

    const availableWidth = contentBox.inlineSize;

    const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
    if (!wrapper) return;
    if (
      availableWidth > 0 ||
      wrapper.clientWidth < wrapper.scrollWidth ||
      wrapper.clientHeight < wrapper.scrollHeight
    ) {
      this.#onResize(availableWidth);
    }
  });

  /** Timeout for debouncing resize events. */
  #resizeTimeout?: ReturnType<typeof requestAnimationFrame>;

  /** Timeout for debouncing forceRecalculation calls. */
  #forceRecalculationTimeout?: ReturnType<typeof setTimeout>;

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<HTMLElement>(this, {
    direction: 'horizontal',
    focusInIndex: (elements: HTMLElement[]) => elements.findIndex(el => !this.#isElementDisabled(el)),
    elements: () => this.#getFocusableElements(),
    isFocusableElement: (el: HTMLElement) => !(el instanceof ToolBarDivider) && !this.#isElementDisabled(el)
  });

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

  /**
   * If true, the tool-bar will have a border (when there is no inverted set) and padding around it.
   * Use this when you want the tool-bar to be visually distinct from surrounding content.
   */
  @property({ type: Boolean, reflect: true }) contained?: boolean;

  /**
   * If true, the tool-bar is disabled and cannot be interacted with.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal True when the tool-bar is empty. */
  @property({ type: Boolean, reflect: true }) empty?: boolean;

  /**
   * Use this if you want the menu button that appears when the tool bar overflows to use the "inverted" variant.
   * This also overrides all slotted button and menu-button variants to `inverted` when set.
   */
  @property({ type: Boolean }) inverted?: boolean;

  /** @internal The tool bar items. */
  @state() items: ToolBarItem[] = [];

  /** @internal The tool bar items that should be shown in the overflow menu. */
  @state() menuItems: ToolBarItem[] = [];

  /** The type of buttons and menu buttons (also overflow menu button). */
  @property() type?: Extract<ButtonFill, 'ghost' | 'outline'>;

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

    if (this.#resizeTimeout) {
      cancelAnimationFrame(this.#resizeTimeout);
    }

    if (this.#forceRecalculationTimeout) {
      clearTimeout(this.#forceRecalculationTimeout);
    }

    // Reset measurements to ensure clean state on reconnect
    this.#needsMeasurement = true;

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('disabled')) {
      // Get all buttons including nested ones (consistent with #updateButtonFillAndVariant)
      const buttons: Element[] = [];

      Array.from(this.children).forEach(el => {
        if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') {
          buttons.push(el);
        }
        buttons.push(...Array.from(el.querySelectorAll('sl-button, sl-menu-button')));
      });

      if (this.disabled) {
        buttons.forEach(el => {
          // Only disable if not already disabled, and mark that we disabled it
          if (!el.hasAttribute('disabled')) {
            el.setAttribute('disabled', '');
            el.setAttribute('data-toolbar-disabled', '');
          }
        });
      } else {
        buttons.forEach(el => {
          // Only remove disabled from buttons/menu-buttons that the toolbar disabled
          if (el.hasAttribute('data-toolbar-disabled')) {
            el.removeAttribute('disabled');
            el.removeAttribute('data-toolbar-disabled');
          }
        });
      }
    }

    if (changes.has('items')) {
      this.menuItems = this.items.filter(item => !item.visible);
    }

    if (changes.has('type') || changes.has('inverted')) {
      const slot = this.renderRoot.querySelector('slot'),
        assigned = slot?.assignedElements({ flatten: true }) ?? [];

      this.#updateButtonAttributes(assigned);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('menuItems')) {
      const menuButton = this.renderRoot.querySelector('sl-menu-button');
      if (menuButton) {
        const allItemsHidden = this.items.every(item => !item.visible);
        menuButton.toggleAttribute('all-items-hidden', allItemsHidden);
      }
    }
  }

  override firstUpdated(): void {
    requestAnimationFrame(() => {
      this.#measureItems();

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

  /**
   * Forces a recalculation of the tool-bar layout using a debounced measurement.
   *
   * In most cases, the tool-bar reacts automatically to size changes and DOM mutations,
   * or can be updated explicitly by calling {@link refresh}. Call this method only in
   * advanced scenarios where those mechanisms are insufficient, such as when the layout
   * is affected by changes outside the tool-bar (e.g. complex nested slots or container
   * size changes that are not observed).
   *
   * When invoked, any pending recalculation is canceled and a new one is scheduled
   * with a 200&nbsp;ms delay. Once the timeout elapses, the tool-bar temporarily reveals
   * the first hidden item, measures the wrapper and items, and internally triggers a
   * resize/measurement pass to recompute which items should be visible or moved into
   * the overflow menu.
   */
  forceRecalculation(): void {
    // Clear any pending recalculation
    if (this.#forceRecalculationTimeout) {
      clearTimeout(this.#forceRecalculationTimeout);
    }

    // Debounce with 200ms delay
    this.#forceRecalculationTimeout = setTimeout(() => {
      const firstHidden = this.items.filter(item => !item.visible)[0];
      if (!firstHidden) {
        return;
      }
      const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
      if (wrapper) {
        this.#onResize(window.innerWidth);
      }
      this.#needsMeasurement = true;
      this.#measureItems();
    }, 200);
  }

  /**
   * Get all focusable elements including visible toolbar items and overflow menu button.
   */
  #getFocusableElements(): HTMLElement[] {
    const visibleItems = (this.items || [])
      .filter(item => item.visible)
      .map(item => {
        // For menu buttons, get the internal sl-button element
        if (item.element instanceof MenuButton) {
          return item.element.renderRoot.querySelector('sl-button') as HTMLElement;
        }
        return item.element;
      })
      .filter((el): el is HTMLElement => el !== null);

    const menuButton = this.renderRoot.querySelector('sl-menu-button');
    if (!menuButton) {
      return visibleItems;
    }
    const menuButtonElement = menuButton.renderRoot?.querySelector('sl-button') as HTMLElement | null;

    return menuButtonElement ? [...visibleItems, menuButtonElement] : visibleItems;
  }

  /**
   * Find the toolbar item associated with an element.
   * Handles both direct elements and internal buttons from menu buttons.
   */
  #findItemForElement(el: HTMLElement): ToolBarItem | undefined {
    return this.items?.find(item => {
      if (item.element === el) {
        return true;
      }
      if (item.element instanceof MenuButton) {
        const internalButton = item.element.renderRoot.querySelector('sl-button');

        return internalButton === el;
      }
      return false;
    });
  }

  /**
   * Check if an element is disabled.
   * For menu buttons, the element might be the internal sl-button from the shadow DOM,
   * so we need to find the original item to get the correct disabled state.
   */
  #isElementDisabled(el: HTMLElement): boolean {
    // Check direct disabled attribute first
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') {
      return true;
    }

    // Find the toolbar item for this element
    const item = this.#findItemForElement(el);

    if (item && 'disabled' in item) {
      return item.disabled ?? false;
    }

    // Check parent menu button for overflow menu button
    const parentMenuButton = el.closest('sl-menu-button');

    if (parentMenuButton && parentMenuButton !== el) {
      return parentMenuButton.hasAttribute('disabled') || parentMenuButton.getAttribute('aria-disabled') === 'true';
    }

    return false;
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

  #measureItems(): void {
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
    if (
      this.offsetParent === null ||
      (wrapper?.clientWidth === wrapper?.scrollWidth && wrapper?.clientHeight === wrapper?.scrollHeight)
    ) {
      this.#needsMeasurement = true;
      return;
    }

    // Ensure all items are visible for accurate measurements
    this.items.forEach(item => {
      item.element.style.display = '';
      item.visible = true;
    });

    // Force layout before measuring
    void this.offsetHeight;

    this.#widths = this.items.map(item => item.element.getBoundingClientRect().width);

    // If measurements are invalid (any width is zero for non-divider items), mark as needing re-measurement
    const hasInvalidMeasurements = this.items.some((item, i) => item.type !== 'divider' && this.#widths[i] === 0);

    this.#needsMeasurement = hasInvalidMeasurements;
  }

  #onResize(availableWidth: number): void {
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]');

    if (!wrapper) {
      return;
    }

    const gap = parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0;

    // If we need measurements, show all items first and measure
    if (this.#needsMeasurement || this.#widths.length === 0) {
      this.items.forEach(item => {
        item.element.style.visibility = '';
        item.element.style.position = '';
        item.visible = true;
      });

      this.#measureItems();
    }

    // If measurements failed or items changed, don't proceed
    if (this.#widths.length === 0 || this.#widths.length !== this.items.length) {
      return;
    }

    // Calculate menu button width (square button based on wrapper height) but this doesn't work if there are no items in the wrapper!! :D
    let menuButtonWidth = wrapper.getBoundingClientRect().height;
    const menuButton = this.renderRoot.querySelector('sl-menu-button');

    if ((isNaN(menuButtonWidth) || menuButtonWidth === 0) && menuButton) {
      menuButtonWidth = menuButton.getBoundingClientRect().width;
    }

    // First pass: determine if we need overflow menu
    let cumulativeWidth = 0,
      needsMenu = false;

    for (let i = 0; i < this.items.length; i++) {
      const itemWidth = this.#widths[i],
        gapWidth = i > 0 ? gap : 0,
        requiredWidth = cumulativeWidth + gapWidth + itemWidth;

      if (requiredWidth > availableWidth) {
        needsMenu = true;
        break;
      }

      cumulativeWidth = requiredWidth;
    }

    // Calculate effective width (reserve space for menu button + gap before it + gap after last item)
    const menuButtonTotalWidth = needsMenu ? menuButtonWidth + gap : 0;
    const effectiveWidth = availableWidth - menuButtonTotalWidth;

    // Second pass: set visibility based on effective width
    cumulativeWidth = 0;
    for (let i = 0; i < this.items.length; i++) {
      const itemWidth = this.#widths[i];
      const gapWidth = i > 0 ? gap : 0;
      const requiredWidth = cumulativeWidth + gapWidth + itemWidth;

      this.items[i].visible = requiredWidth <= effectiveWidth;

      if (this.items[i].visible) {
        cumulativeWidth = requiredWidth;
      }
    }

    // Third pass: hide orphaned dividers
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].type !== 'divider' || !this.items[i].visible) {
        continue;
      }

      const hasVisibleBefore = i > 0 && this.items.slice(0, i).some(item => item.visible && item.type !== 'divider');
      const hasVisibleAfter =
        i < this.items.length - 1 && this.items.slice(i + 1).some(item => item.visible && item.type !== 'divider');

      if (!hasVisibleBefore || !hasVisibleAfter) {
        this.items[i].visible = false;
      }
    }

    this.items.forEach(item => {
      item.element.style.visibility = item.visible ? '' : 'hidden';
      item.element.style.position = item.visible ? '' : 'absolute';
    });

    const allItemsHidden = this.items.every(item => !item.visible);

    this.menuItems = this.items.filter(item => !item.visible);

    if (menuButton) {
      if (allItemsHidden) {
        menuButton.toggleAttribute('all-items-hidden', true);
      } else {
        menuButton.toggleAttribute('all-items-hidden', false);
      }
    }

    this.requestUpdate();
    this.#rovingTabindexController.clearElementCache();
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }) {
    // Ignore events from nested slots.
    if (event.target !== this.renderRoot.querySelector('slot')) {
      return;
    }

    const assigned = event.target.assignedElements({ flatten: true });

    this.#updateButtonAttributes(assigned);

    requestAnimationFrame(() => {
      this.#updateMapping();
    });
  }

  #updateButtonAttributes(elements: Element[]): void {
    elements.forEach(el => {
      this.#updateButtonFillAndVariant(el);
      this.#updateDividerVariant(el);
    });
  }

  #updateButtonFillAndVariant(el: Element): void {
    const targets: Element[] = [];

    if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') {
      targets.push(el);
    }
    targets.push(...Array.from(el.querySelectorAll('sl-button, sl-menu-button')));

    targets.forEach(btn => {
      if (this.type) {
        btn.setAttribute('fill', this.type);
      }
      if (this.inverted) {
        btn.setAttribute('variant', 'inverted');
      } else {
        btn.removeAttribute('variant');
      }
    });
  }

  #updateDividerVariant(el: Element): void {
    const dividers: Element[] = [];

    if (el.tagName === 'SL-TOOL-BAR-DIVIDER') {
      dividers.push(el);
    }
    dividers.push(...Array.from(el.querySelectorAll('sl-tool-bar-divider')));

    dividers.forEach(divider => {
      if (this.inverted) {
        divider.setAttribute('inverted', '');
      } else {
        divider.removeAttribute('inverted');
      }
    });
  }

  #updateMapping(): void {
    const slot = this.renderRoot.querySelector('slot')!,
      elements = slot.assignedElements({ flatten: true });

    this.empty = elements.length === 0;

    this.items = elements
      .map(element => {
        if (element instanceof Button) {
          element.style.visibility = '';
          element.style.position = '';
          return this.#mapButtonToItem(element);
        } else if (element instanceof MenuButton) {
          return this.#mapMenuButtonToItem(element);
        } else if (element instanceof ToolBarDivider) {
          return { element, type: 'divider', visible: true };
        } else if (!['SL-TOOLTIP'].includes(element.tagName)) {
          console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar.`);
        }

        return undefined;
      })
      .filter(item => item !== undefined) as ToolBarItem[];

    this.#needsMeasurement = true;

    // The menu-button may have appeared or disappeared, so we need to re-measure
    this.#measureItems();
    const contentBox = this.getBoundingClientRect();
    this.#onResize(contentBox.width);
  }
}
