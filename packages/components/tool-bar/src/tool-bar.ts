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

  /** Most recent available width (in pixels) used to detect significant size changes and avoid flickering. */
  #lastAvailableWidth = 0;

  /**
   * Default and fallback cache for the menu button size (pixels).
   * Used when actual size is unavailable.
   *   - menu button width/height: 36px, icon-only block-size + border-width in button.scss
   */
  #menuButtonSizeCache = 36;

  /** Cached measured width (in pixels) of the overflow/menu button. */
  #menuButtonSize?: number;

  /** Observe changes to the child elements. */
  #mutationObserver = new MutationObserver(() => this.#updateMapping());

  /** Flag indicating whether item width measurements are required before recalculating layout. */
  #needsMeasurement = true;

  /** Flag indicating whether the component has completed its first update. */
  #isInitialized = false;

  /** Observe changes to the size of the host element. */
  #resizeObserver = new ResizeObserver(() => this.#onResize());

  /** Timeout for debouncing resize events. */
  #resizeTimeout?: number;

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<HTMLElement>(this, {
    direction: 'horizontal',
    focusInIndex: (elements: HTMLElement[]) => elements.findIndex(el => !this.#isElementDisabled(el)),
    elements: (): HTMLElement[] => {
      const visibleItems: HTMLElement[] = (this.items || [])
        .filter(item => item.visible)
        .map(item => {
          // For menu buttons, get the internal sl-button element
          if (item.element instanceof MenuButton) {
            return item.element.renderRoot.querySelector('sl-button') as HTMLElement;
          }
          return item.element;
        })
        .filter((el): el is HTMLElement => el !== null);

      const menuButton = this.renderRoot.querySelector('sl-menu-button'),
        menuButtonElement = menuButton?.renderRoot.querySelector('sl-button') as HTMLElement | null;

      return menuButtonElement ? [...visibleItems, menuButtonElement] : visibleItems;
    },
    isFocusableElement: (el: HTMLElement) => {
      if (el instanceof ToolBarDivider) {
        return false;
      }

      return !this.#isElementDisabled(el);
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

  /** Use this if you want the menu button to use the "inverted" variant.
   * This also overrides all button variants to `inverted` when set.
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

    // Force a resize check when reconnecting if measurements are invalid
    if (this.#isInitialized && this.#needsMeasurement) {
      requestAnimationFrame(() => {
        // Only force resize if we have invalid measurements
        const hasInvalidMeasurements = this.#widths.some((w, i) => this.items[i]?.type !== 'divider' && w === 0);
        if (hasInvalidMeasurements || this.#widths.length === 0) {
          this.#onResize();
        }
      });
    }
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();

    if (this.#resizeTimeout) {
      cancelAnimationFrame(this.#resizeTimeout);
    }

    // Reset measurements to ensure clean state on reconnect
    this.#needsMeasurement = true;
    this.#lastAvailableWidth = 0;
    this.#widths = [];
    this.#totalWidth = 0;
    this.#menuButtonSize = undefined;

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('disabled')) {
      // Get direct children from the light DOM (slotted content)
      const children = Array.from(this.children);

      if (this.disabled) {
        children.forEach(el => {
          // Only set disabled on interactive elements (buttons, menu-buttons)
          if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') {
            // Only disable if not already disabled, and mark that we disabled it
            if (!el.hasAttribute('disabled')) {
              el.setAttribute('disabled', '');
              el.setAttribute('data-toolbar-disabled', '');
            }
          }
        });
      } else {
        children.forEach(el => {
          // Only remove disabled from buttons/menu-buttons that the toolbar disabled
          if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') {
            if (el.hasAttribute('data-toolbar-disabled')) {
              el.removeAttribute('disabled');
              el.removeAttribute('data-toolbar-disabled');
            }
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

  override firstUpdated(): void {
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]');

    if (wrapper) {
      this.#measureItems(wrapper);
    }

    this.#resizeObserver.observe(this);

    this.#rovingTabindexController.clearElementCache();

    this.#isInitialized = true;
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
   * Check if an element is disabled.
   * For menu buttons, the element might be the internal sl-button from the shadow DOM,
   * so we need to find the original item to get the correct disabled state.
   */
  #isElementDisabled(el: HTMLElement): boolean {
    // Check direct disabled attribute first
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') {
      return true;
    }

    // For elements that might be internal buttons from menu buttons, find the original item
    const item = this.items?.find(item => {
      // Check if this is the element itself
      if (item.element === el) {
        return true;
      }
      // Check if this is an internal button of a menu button
      if (item.element instanceof MenuButton) {
        const internalButton = item.element.renderRoot.querySelector('sl-button');
        return internalButton === el;
      }
      return false;
    });

    // If we found the item, use its disabled state
    if (item && 'disabled' in item) {
      return item.disabled ?? false;
    }

    // Check parent element for overflow menu button
    const parentMenuButton = el.closest('sl-menu-button');
    if (parentMenuButton && parentMenuButton !== el) {
      return parentMenuButton.hasAttribute('disabled') || parentMenuButton.getAttribute('aria-disabled') === 'true';
    }

    return false;
  }

  #getAvailableWidth(): number {
    const hostWidth = this.getBoundingClientRect().width;

    const hostStyles = getComputedStyle(this),
      hostPadding = parseFloat(hostStyles.paddingLeft || '0') + parseFloat(hostStyles.paddingRight || '0');

    return hostWidth - hostPadding;
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

  #measureItems(wrapper: Element): void {
    if (this.offsetParent === null) {
      this.#needsMeasurement = true;

      return;
    }

    const gap = parseInt(getComputedStyle(wrapper).getPropertyValue('gap')) || 0;

    // Ensure all items are visible for accurate measurements
    this.items.forEach(item => {
      item.element.style.display = '';
      item.visible = true;
    });

    // Force layout before measuring
    void this.offsetHeight; // Force reflow

    this.#widths = this.items.map(item => item.element.getBoundingClientRect().width);
    this.#totalWidth = this.#widths.reduce((sum, w, i) => sum + w + (i < this.#widths.length - 1 ? gap : 0), 0);

    // If measurements are invalid (any width is zero for non-divider items), mark as needing re-measurement
    const hasInvalidMeasurements = this.items.some((item, i) => item.type !== 'divider' && this.#widths[i] === 0);

    if (hasInvalidMeasurements && this.#isInitialized) {
      this.#needsMeasurement = true;
    } else {
      this.#needsMeasurement = false;
    }
  }

  #onResize(): void {
    if (this.#resizeTimeout) {
      cancelAnimationFrame(this.#resizeTimeout);
    }

    this.#resizeTimeout = requestAnimationFrame(() => {
      const currentWidth = this.#getAvailableWidth();

      // Only proceed if width actually changed significantly
      // This prevents infinite loops when container has fit-content sizing
      if (Math.abs(currentWidth - this.#lastAvailableWidth) < 2) {
        return;
      }

      // Update last width before performing resize to prevent multiple triggers
      this.#lastAvailableWidth = currentWidth;

      this.#performResize();
    });
  }

  #performResize(): void {
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
    const RESIZE_THRESHOLD = 5; // Pixel threshold that prevents flickering caused by slight measurement fluctuations
    const widthChanged = Math.abs(availableWidth - this.#lastAvailableWidth) > RESIZE_THRESHOLD;

    // Only measure if we have no measurements yet, or if the width changed significantly
    const needsInitialMeasurement =
      this.#needsMeasurement && (!this.#totalWidth || !this.#widths.length || widthChanged);

    if (needsInitialMeasurement) {
      this.#measureItems(wrapper);
      this.#lastAvailableWidth = availableWidth;

      // Skip visibility calculation on first measurement to allow the container
      // to establish its natural size before determining which items need overflow.
      // If the container width matches or exceeds the content width, keep all items visible.
      if (availableWidth >= this.#totalWidth) {
        this.items.forEach(item => {
          item.element.style.display = '';
          item.visible = true;
        });
        this.menuItems = [];
        this.requestUpdate('items');
        this.#rovingTabindexController.clearElementCache();
        return;
      }
      this.#lastAvailableWidth = availableWidth;
    }

    if (widthChanged) {
      this.#lastAvailableWidth = availableWidth;
      // If width changed significantly, and we previously had measurements force re-measurement
      if (this.#widths.length > 0) {
        this.#needsMeasurement = true;
        this.#measureItems(wrapper);
      }
    }

    if (this.#totalWidth > 0 && this.items.length > 0) {
      const widthDifference = availableWidth - this.#totalWidth;
      // If available width is within a reasonable range of total width, assume intrinsic sizing
      // We allow negative values (slightly less width) to account for rounding/measurement timing issues
      // Wider range needed for Safari
      const looksLikeIntrinsicSizing = widthDifference >= -10 && widthDifference <= 20;

      if (looksLikeIntrinsicSizing) {
        this.items.forEach(item => {
          item.element.style.display = '';
          item.visible = true;
        });
        this.menuItems = [];
        this.requestUpdate('items');
        this.#rovingTabindexController.clearElementCache();
        return;
      }
    }

    // First pass: calculate visibility assuming no menu button
    let acc = 0;
    for (let i = 0; i < this.items.length; i++) {
      const gapBefore = acc > 0 ? gap : 0;
      const widthNeeded = acc + this.#widths[i] + gapBefore;
      this.items[i].visible = widthNeeded <= availableWidth;
      if (this.items[i].visible) {
        acc = widthNeeded;
      }
    }

    // Check if we need the overflow menu
    const allVisible = availableWidth - 2 * gap > this.#totalWidth;

    if (!allVisible) {
      // Second pass: recalculate with space reserved for menu button
      let buttonSize = this.#menuButtonSize ?? this.#menuButtonSizeCache;

      // Try to measure existing menu button from previous render
      const menuButton = this.renderRoot.querySelector('sl-menu-button');
      if (menuButton && this.#menuButtonSize == null) {
        const actualSize = Math.round(menuButton.getBoundingClientRect().width);
        if (actualSize > 0) {
          this.#menuButtonSize = actualSize;
          buttonSize = actualSize;
        }
      }

      // Fallback to wrapper height if no measured size yet
      const wrapperHeight = Math.round(wrapper.getBoundingClientRect().height);
      if (this.#menuButtonSize == null && wrapperHeight > 0) {
        this.#menuButtonSizeCache = wrapperHeight;
        buttonSize = wrapperHeight;
      }

      const effectiveAvailable = availableWidth - buttonSize - 2 * gap;
      acc = 0; // Reset accumulator for second pass

      for (let i = 0; i < this.items.length; i++) {
        const gapBefore = acc > 0 ? gap : 0;
        const widthNeeded = acc + this.#widths[i] + gapBefore;
        this.items[i].visible = widthNeeded <= effectiveAvailable;
        if (this.items[i].visible) {
          acc = widthNeeded;
        }
      }

      // Hide dividers with no visible items before or after them
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].type === 'divider' && this.items[i].visible) {
          const hasVisibleBefore =
            i > 0 && this.items.slice(0, i).some(item => item.visible && item.type !== 'divider');
          const hasVisibleAfter =
            i < this.items.length - 1 && this.items.slice(i + 1).some(item => item.visible && item.type !== 'divider');

          if (!hasVisibleBefore || !hasVisibleAfter) {
            this.items[i].visible = false;
          }
        }
      }

      // After hiding dividers, verify that visible items still fit
      acc = 0;
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].visible) {
          acc += this.#widths[i] + gap;
        }
      }

      // If total width exceeds available space, hide items from the end
      if (acc > effectiveAvailable) {
        for (let i = this.items.length - 1; i >= 0 && acc > effectiveAvailable; i--) {
          if (this.items[i].visible && this.items[i].type !== 'divider') {
            this.items[i].visible = false;
            acc -= this.#widths[i] + gap;
          }
        }
      }
    }

    const allHidden = this.items.every(item => !item.visible);
    if (allHidden && this.items.length > 0) {
      const hasInvalidMeasurements = this.#widths.some((w, i) => this.items[i].type !== 'divider' && w === 0);

      if (hasInvalidMeasurements) {
        this.items.forEach(item => {
          item.element.style.display = '';
          item.visible = true;
        });
        this.menuItems = [];
        this.requestUpdate('items');
        this.#rovingTabindexController.clearElementCache();
        // Mark for re-measurement on next resize
        this.#needsMeasurement = true;
        return;
      }
    }

    this.items.forEach(item => {
      item.element.style.display = item.visible ? '' : 'none';
    });

    this.menuItems = this.items.filter(item => !item.visible);

    requestAnimationFrame(() => {
      const menuButton = this.renderRoot.querySelector('sl-menu-button');
      const allHidden = this.items.every(item => !item.visible);
      menuButton?.classList.toggle('all-hidden', allHidden);
    });

    this.requestUpdate('items');

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
      const targets: Element[] = [];

      if (el.tagName === 'SL-BUTTON' || el.tagName === 'SL-MENU-BUTTON') targets.push(el);
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

      // Also update dividers (both direct children and nested)
      const dividers: Element[] = [];
      if (el.tagName === 'SL-TOOL-BAR-DIVIDER') dividers.push(el);
      dividers.push(...Array.from(el.querySelectorAll('sl-tool-bar-divider')));

      dividers.forEach(divider => {
        if (this.inverted) {
          divider.setAttribute('inverted', '');
        } else {
          divider.removeAttribute('inverted');
        }
      });
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
          return { element, type: 'divider', visible: true };
        } else if (!['SL-TOOLTIP'].includes(element.tagName)) {
          console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar.`);
        }

        return undefined;
      })
      .filter(item => item !== undefined) as ToolBarItem[];

    this.#needsMeasurement = true;

    // Reconnect the resize observer to the host, but only after initialization
    if (this.#isInitialized) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver.observe(this);
    }
  }
}
