import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonFill } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem, MenuItemGroup } from '@sl-design-system/menu';
import { RovingTabindexController } from '@sl-design-system/shared';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { updateChildAttributes } from './attribute-propagation.js';
import { syncDisabledState } from './disabled-state.js';
import { type ToolBarItem, mapElementsToItems } from './mapping.js';
import {
  applyVisibility,
  calculateVisibility,
  getContentBoxWidth,
  hasWrapperOverflow,
  isFitContent,
  measureConstrainedWidth,
  measureItemWidths,
  measureMenuButtonWidth,
  revealAllItems
} from './overflow.js';
import { ToolBarDivider } from './tool-bar-divider.js';
import styles from './tool-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar': ToolBar;
  }
}

/**
 * A responsive toolbar that lays out buttons, menu-buttons, and dividers in a horizontal row. When
 * the available space is too narrow to fit all items, the toolbar automatically moves overflowing
 * items into an overflow menu at the end.
 *
 * The toolbar maps its slotted elements to internal data objects (see `mapping.ts`), measures their
 * widths, and recalculates visibility on resize. Overflow items are rendered as menu-items inside a
 * popup menu-button.
 *
 * Child attributes like `fill` and `inverted` are propagated to slotted buttons, and the `disabled`
 * state of the toolbar is synced to all child buttons.
 *
 * By default the toolbar has no border or padding, making it suitable for embedding inside other
 * components. Use the `contained` attribute for a toolbar with spacing. Make sure there is enough
 * space around the toolbar to show focus outlines.
 *
 * @csspart wrapper - The wrapper element that contains the tool bar items.
 *
 * @slot default - The tool bar items.
 */
@localized()
export class ToolBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
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

  /** Timeout for debouncing forceRecalculation calls. */
  #forceRecalculationTimeout?: ReturnType<typeof setTimeout>;

  /** @internal */
  #internals = this.attachInternals();

  /** Observe changes to the child elements. */
  #mutationObserver = new MutationObserver(() => this.refresh());

  /**
   * Whether the toolbar is wider than its parent and needs CSS containment to measure available
   * space.
   */
  #fitContent = false;

  /**
   * The host's content-box width at the last overflow calculation, used to detect width changes in
   * the ResizeObserver callback and avoid unnecessary recalculations.
   */
  #lastHostWidth = 0;

  /** Flag indicating whether item width measurements are required before recalculating layout. */
  #needsMeasurement = true;

  /** Observe changes to the size of the host element. */
  #resizeObserver = new ResizeObserver(entries => {
    if (!this.wrapper) {
      return;
    }

    const hostEntry = entries.find(e => e.target === this),
      parentEntry = entries.find(e => e.target !== this);

    // Only recalculate when there is real overflow, a pending measurement,
    // the parent changed size, or the toolbar's own width changed.
    const widthChanged =
      hostEntry !== undefined && Math.ceil(getContentBoxWidth(this)) !== this.#lastHostWidth;

    if (parentEntry || hasWrapperOverflow(this.wrapper) || this.#needsMeasurement || widthChanged) {
      this.#onResize();
    }
  });

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<HTMLElement>(this, {
    direction: 'horizontal',
    focusInIndex: (elements: HTMLElement[]) => elements.findIndex(el => !this.#isDisabled(el)),
    elements: () => this.#getFocusableElements(),
    isFocusableElement: (el: HTMLElement) =>
      !(el instanceof ToolBarDivider) && !this.#isDisabled(el)
  });

  /** Cached widths (in pixels) for each tool-bar item, used to determine item visibility. */
  #widths: number[] = [];

  /**
   * The horizontal alignment within the tool-bar.
   *
   * @default 'start'
   */
  @property({ reflect: true }) align?: 'start' | 'end';

  /**
   * If `true`, the tool-bar will have a border (when there is no inverted set) and padding around
   * it. Use this when you want the tool-bar to be visually distinct from surrounding content.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) contained?: boolean;

  /**
   * If true, the tool-bar is disabled and cannot be interacted with.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * The fill of buttons and menu buttons (also overflow menu button).
   *
   * @default undefined
   */
  @property() fill?: ButtonFill;

  /**
   * Use this if you want the menu button that appears when the tool bar overflows to use the
   * "inverted" variant. Slotted buttons and menu-buttons without an explicit `variant` also use the
   * `inverted` variant when set.
   *
   * @default false
   */
  @property({ type: Boolean }) inverted?: boolean;

  /** @internal The tool bar items. */
  @state() items: ToolBarItem[] = [];

  /** @internal The menu button element. */
  @query('sl-menu-button') menuButton?: MenuButton;

  /** @internal The tool bar items that should be shown in the overflow menu. */
  @state() menuItems: ToolBarItem[] = [];

  /** @internal The wrapper element. */
  @query('[part="wrapper"]') wrapper?: HTMLElement;

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
    this.#mutationObserver.disconnect();
    this.#resizeObserver.disconnect();

    if (this.#forceRecalculationTimeout) {
      clearTimeout(this.#forceRecalculationTimeout);
      this.#forceRecalculationTimeout = undefined;
    }

    // Reset measurements to ensure clean state on reconnect
    this.#needsMeasurement = true;
    this.#fitContent = false;
    this.#lastHostWidth = 0;

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('disabled') || this.disabled) {
      syncDisabledState(this, this.disabled);
    }

    if (changes.has('items')) {
      this.menuItems = this.items.filter(item => !item.visible);
    }

    if (changes.has('fill') || changes.has('inverted')) {
      const slot = this.renderRoot.querySelector('slot'),
        assigned = slot?.assignedElements({ flatten: true }) ?? [];

      updateChildAttributes(assigned, this.fill, this.inverted);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('menuItems')) {
      this.menuButton?.toggleAttribute(
        'all-items-hidden',
        this.items.every(item => !item.visible)
      );
    }
  }

  override firstUpdated(): void {
    const slot = this.renderRoot.querySelector('slot')!;

    if (slot.assignedElements({ flatten: true }).length === 0) {
      this.#internals.states.add('empty');
    }

    requestAnimationFrame(() => {
      this.#measureItems();

      // Calculate overflow immediately so items are hidden before the first paint, preventing a flash of all items visible.
      this.#onResize();

      this.#resizeObserver.observe(this);
      this.#rovingTabindexController.clearElementCache();
    });
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>

      <sl-menu-button
        .ariaDisabled=${this.disabled ? 'true' : null}
        aria-label=${msg('Show more', { id: 'sl.toolBar.showMore' })}
        fill=${ifDefined(this.fill)}
        ?hidden=${this.menuItems.length === 0}
        variant=${ifDefined(this.inverted ? 'inverted' : undefined)}>
        <sl-icon name="ellipsis-vertical" slot="button"></sl-icon>
        ${this.menuItems.map(item => this.renderMenuItem(item))}
      </sl-menu-button>
    `;
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
      const isDisabled = item.disabled || item.ariaDisabled;

      return html`
        <sl-menu-item
          @click=${isDisabled ? undefined : () => item.click?.()}
          aria-disabled=${ifDefined(isDisabled ? 'true' : undefined)}
          ?selectable=${item.selectable}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
        </sl-menu-item>
      `;
    } else {
      const isDisabled = item.disabled || item.ariaDisabled;

      return html`
        <sl-menu-item aria-disabled=${ifDefined(isDisabled ? 'true' : undefined)}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
          <sl-menu slot="submenu"
            >${item.menuItems.map(menuItem => this.renderMenuItem(menuItem))}</sl-menu
          >
        </sl-menu-item>
      `;
    }
  }

  /** Delegate focus to the roving tabindex controller so the first focusable item receives focus. */
  override focus(): void {
    this.#rovingTabindexController.focus();
  }

  /**
   * Re-maps slotted elements, measures their widths, and recalculates which items are visible vs.
   * moved into the overflow menu. Called automatically on slot changes and DOM mutations, but you
   * may need to call it manually when using nested slots (which don't trigger `slotchange` or
   * `MutationObserver`).
   */
  refresh(): void {
    const elements =
      this.renderRoot.querySelector('slot')?.assignedElements({ flatten: true }) ?? [];

    if (elements.length === 0) {
      this.#internals.states.add('empty');
    } else {
      this.#internals.states.delete('empty');
    }

    for (const element of elements) {
      if (element instanceof HTMLElement) {
        element.style.visibility = '';
        element.style.position = '';
      }
    }

    this.items = mapElementsToItems(elements);
    this.#needsMeasurement = true;
    this.#fitContent = false;
    this.#lastHostWidth = 0;

    if (this.parentElement) {
      this.#resizeObserver.unobserve(this.parentElement);
    }

    // The menu-button may have appeared or disappeared, so we need to re-measure
    this.#measureItems();
    this.#onResize();
  }

  /**
   * Forces a recalculation of the tool-bar layout using a debounced measurement.
   *
   * In most cases, the tool-bar reacts automatically to size changes and DOM mutations, or can be
   * updated explicitly by calling {@link refresh}. Call this method only in advanced scenarios where
   * those mechanisms are insufficient, such as when the layout is affected by changes outside the
   * tool-bar (e.g. complex nested slots or container size changes that are not observed).
   *
   * When invoked, any pending recalculation is canceled and a new one is scheduled with a 200ms
   * delay. Once the timeout elapses, the tool-bar temporarily reveals the first hidden item,
   * measures the wrapper and items, and internally triggers a resize/measurement pass to recompute
   * which items should be visible or moved into the overflow menu.
   */
  forceRecalculation(): void {
    if (this.#forceRecalculationTimeout) {
      clearTimeout(this.#forceRecalculationTimeout);
    }

    this.#forceRecalculationTimeout = setTimeout(() => {
      const firstHidden = this.items.find(item => !item.visible);
      if (!firstHidden) {
        return;
      }

      this.#needsMeasurement = true;
      this.#onResize();
    }, 200);
  }

  #onResize(): void {
    if (!this.wrapper) {
      return;
    }

    const gap = parseFloat(getComputedStyle(this.wrapper).getPropertyValue('gap')) || 0;

    // Show all items once, so we can measure both items and available width.
    revealAllItems(this.items);

    // If we need measurements, measure the items now that they are visible.
    if (this.#needsMeasurement || this.#widths.length === 0) {
      this.#measureItems();
    }

    // If measurements failed, are still pending, or items changed, don't proceed.
    if (
      this.#needsMeasurement ||
      this.#widths.length === 0 ||
      this.#widths.length !== this.items.length
    ) {
      return;
    }

    // Detect fit-content: if the toolbar overflows its parent,
    // switch to CSS containment and watch the parent for changes.
    if (!this.#fitContent && this.parentElement && isFitContent(this, this.parentElement)) {
      this.#fitContent = true;
      this.#resizeObserver.observe(this.parentElement);
    }

    let availableWidth: number;

    if (this.#fitContent) {
      // Fit-content: use CSS containment to measure the external constraint
      availableWidth = measureConstrainedWidth(this, this.#internals);
    } else {
      availableWidth = getContentBoxWidth(this);
    }

    // Remove `all-items-hidden` so the margin resolves correctly, but keep `hidden` to avoid layout changes during measurement.
    this.menuButton?.removeAttribute('all-items-hidden');

    const menuButtonWidth = measureMenuButtonWidth(this.wrapper, this.menuButton ?? undefined, gap);

    // Round up to avoid sub-pixel rounding issues that can cause false overflow when all items actually fit.
    availableWidth = Math.ceil(availableWidth);

    this.#lastHostWidth = Math.ceil(getContentBoxWidth(this));

    calculateVisibility(this.items, this.#widths, availableWidth, gap, menuButtonWidth);

    const hiddenItems = this.items.filter(item => !item.visible),
      allItemsHidden = hiddenItems.length === this.items.length;

    this.menuButton?.toggleAttribute('hidden', hiddenItems.length === 0);
    this.menuButton?.toggleAttribute('all-items-hidden', allItemsHidden);

    applyVisibility(this.items);
    this.menuItems = hiddenItems;

    if (this.menuItems.length > 0 && this.parentElement) {
      this.#resizeObserver.observe(this.parentElement);
    } else if (this.menuItems.length === 0 && !this.#fitContent && this.parentElement) {
      this.#resizeObserver.unobserve(this.parentElement);
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

    updateChildAttributes(assigned, this.fill, this.inverted);

    if (this.disabled) {
      syncDisabledState(this, true);
    }

    requestAnimationFrame(() => {
      this.refresh();
    });
  }

  /**
   * Check if an element is disabled. For menu buttons, the element might be the internal sl-button
   * from the shadow DOM, so we need to find the original item to get the correct disabled state.
   */
  #isDisabled(el: HTMLElement): boolean {
    const isNativelyDisabled =
      el.hasAttribute('disabled') ||
      (el instanceof Button || el instanceof MenuButton ? el.disabled : false);

    if (isNativelyDisabled) {
      return true;
    }

    // Find the toolbar item for this element
    const item = this.#findItemForElement(el);

    if (item && 'disabled' in item && item.disabled) {
      return true;
    }

    // Check parent menu button for overflow menu button
    const parentMenuButton = el.closest('sl-menu-button');

    if (parentMenuButton && parentMenuButton !== el) {
      if (parentMenuButton.hasAttribute('disabled') || parentMenuButton.disabled) {
        return true;
      }
    }

    return false;
  }

  /** Get all focusable elements including visible toolbar items and overflow menu button. */
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

    if (!this.menuButton || this.menuItems.length === 0) {
      return visibleItems;
    }

    const menuButtonElement = this.menuButton?.renderRoot?.querySelector('sl-button');

    return menuButtonElement ? [...visibleItems, menuButtonElement] : visibleItems;
  }

  /**
   * Find the toolbar item associated with an element. Handles both direct elements and internal
   * buttons from menu buttons.
   */
  #findItemForElement(el: HTMLElement): ToolBarItem | undefined {
    return this.items?.find(item => {
      if (item.element === el) {
        return true;
      } else if (item.element instanceof MenuButton) {
        const internalButton = item.element.renderRoot.querySelector('sl-button');

        return internalButton === el;
      }

      return false;
    });
  }

  #measureItems(): void {
    // Skip measurement when the element has no layout boxes, as widths cannot be measured yet
    if (this.getClientRects().length === 0) {
      this.#needsMeasurement = true;
      return;
    }

    // Ensure all items are visible for accurate measurements
    revealAllItems(this.items);

    // Force layout before measuring
    void this.offsetHeight;

    const widths = measureItemWidths(this.items);
    if (widths) {
      this.#widths = widths;
    }

    // If measurements failed, we need to try again later when the items are visible
    this.#needsMeasurement = !widths;
  }
}
