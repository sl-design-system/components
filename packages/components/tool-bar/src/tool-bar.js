var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __typeError = msg2 => {
  throw TypeError(msg2);
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg2) => member.has(obj) || __typeError('Cannot ' + msg2);
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'),
  getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _forceRecalculationTimeout,
  _internals,
  _mutationObserver,
  _fitContent,
  _lastHostWidth,
  _needsMeasurement,
  _resizeObserver,
  _rovingTabindexController,
  _widths,
  _ToolBar_instances,
  onResize_fn,
  onSlotChange_fn,
  isDisabled_fn,
  getFocusableElements_fn,
  findItemForElement_fn,
  measureItems_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem, MenuItemGroup } from '@sl-design-system/menu';
import { RovingTabindexController } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { updateChildAttributes } from './attribute-propagation.js';
import { syncDisabledState } from './disabled-state.js';
import { mapElementsToItems } from './mapping.js';
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
export let ToolBar = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _ToolBar_instances);
    /** Timeout for debouncing forceRecalculation calls. */
    __privateAdd(this, _forceRecalculationTimeout);
    /** @internal */
    __privateAdd(this, _internals, this.attachInternals());
    /** Observe changes to the child elements. */
    __privateAdd(this, _mutationObserver, new MutationObserver(() => this.refresh()));
    /**
     * Whether the toolbar is wider than its parent and needs CSS containment to measure available
     * space.
     */
    __privateAdd(this, _fitContent, false);
    /**
     * The host's content-box width at the last overflow calculation, used to detect width changes
     * in the ResizeObserver callback and avoid unnecessary recalculations.
     */
    __privateAdd(this, _lastHostWidth, 0);
    /** Flag indicating whether item width measurements are required before recalculating layout. */
    __privateAdd(this, _needsMeasurement, true);
    /** Observe changes to the size of the host element. */
    __privateAdd(
      this,
      _resizeObserver,
      new ResizeObserver(entries => {
        if (!this.wrapper) {
          return;
        }
        const hostEntry = entries.find(e => e.target === this),
          parentEntry = entries.find(e => e.target !== this);
        const widthChanged =
          hostEntry !== void 0 &&
          Math.ceil(getContentBoxWidth(this)) !== __privateGet(this, _lastHostWidth);
        if (
          parentEntry ||
          hasWrapperOverflow(this.wrapper) ||
          __privateGet(this, _needsMeasurement) ||
          widthChanged
        ) {
          __privateMethod(this, _ToolBar_instances, onResize_fn).call(this);
        }
      })
    );
    /** Manage the keyboard navigation. */
    __privateAdd(
      this,
      _rovingTabindexController,
      new RovingTabindexController(this, {
        direction: 'horizontal',
        focusInIndex: elements =>
          elements.findIndex(
            el => !__privateMethod(this, _ToolBar_instances, isDisabled_fn).call(this, el)
          ),
        elements: () =>
          __privateMethod(this, _ToolBar_instances, getFocusableElements_fn).call(this),
        isFocusableElement: el =>
          !(el instanceof ToolBarDivider) &&
          !__privateMethod(this, _ToolBar_instances, isDisabled_fn).call(this, el)
      })
    );
    /** Cached widths (in pixels) for each tool-bar item, used to determine item visibility. */
    __privateAdd(this, _widths, []);
    this.items = [];
    this.menuItems = [];
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-menu': Menu,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
      'sl-menu-item-group': MenuItemGroup
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'toolbar');
    __privateGet(this, _mutationObserver).observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-disabled', 'disabled']
    });
  }
  disconnectedCallback() {
    __privateGet(this, _mutationObserver).disconnect();
    __privateGet(this, _resizeObserver).disconnect();
    if (__privateGet(this, _forceRecalculationTimeout)) {
      clearTimeout(__privateGet(this, _forceRecalculationTimeout));
      __privateSet(this, _forceRecalculationTimeout, void 0);
    }
    __privateSet(this, _needsMeasurement, true);
    __privateSet(this, _fitContent, false);
    __privateSet(this, _lastHostWidth, 0);
    super.disconnectedCallback();
  }
  willUpdate(changes) {
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
  updated(changes) {
    super.updated(changes);
    if (changes.has('menuItems')) {
      this.menuButton?.toggleAttribute(
        'all-items-hidden',
        this.items.every(item => !item.visible)
      );
    }
  }
  firstUpdated() {
    const slot = this.renderRoot.querySelector('slot');
    if (slot.assignedElements({ flatten: true }).length === 0) {
      __privateGet(this, _internals).states.add('empty');
    }
    requestAnimationFrame(() => {
      __privateMethod(this, _ToolBar_instances, measureItems_fn).call(this);
      __privateMethod(this, _ToolBar_instances, onResize_fn).call(this);
      __privateGet(this, _resizeObserver).observe(this);
      __privateGet(this, _rovingTabindexController).clearElementCache();
    });
  }
  render() {
    return html`
      <div part="wrapper">
        <slot @slotchange=${__privateMethod(this, _ToolBar_instances, onSlotChange_fn)}></slot>
      </div>

      <sl-menu-button
        .ariaDisabled=${this.disabled ? 'true' : null}
        aria-label=${msg('Show more', { id: 'sl.toolBar.showMore' })}
        fill=${ifDefined(this.fill)}
        ?hidden=${this.menuItems.length === 0}
        variant=${ifDefined(this.inverted ? 'inverted' : void 0)}>
        <sl-icon name="ellipsis-vertical" slot="button"></sl-icon>
        ${this.menuItems.map(item => this.renderMenuItem(item))}
      </sl-menu-button>
    `;
  }
  /** @internal */
  renderMenuItem(item) {
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
          @click=${isDisabled ? void 0 : () => item.click?.()}
          aria-disabled=${ifDefined(isDisabled ? 'true' : void 0)}
          ?selectable=${item.selectable}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
        </sl-menu-item>
      `;
    } else {
      const isDisabled = item.disabled || item.ariaDisabled;
      return html`
        <sl-menu-item aria-disabled=${ifDefined(isDisabled ? 'true' : void 0)}>
          ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
          <sl-menu slot="submenu"
            >${item.menuItems.map(menuItem => this.renderMenuItem(menuItem))}</sl-menu
          >
        </sl-menu-item>
      `;
    }
  }
  /** Delegate focus to the roving tabindex controller so the first focusable item receives focus. */
  focus() {
    __privateGet(this, _rovingTabindexController).focus();
  }
  /**
   * Re-maps slotted elements, measures their widths, and recalculates which items are visible vs.
   * moved into the overflow menu. Called automatically on slot changes and DOM mutations, but you
   * may need to call it manually when using nested slots (which don't trigger `slotchange` or
   * `MutationObserver`).
   */
  refresh() {
    const elements =
      this.renderRoot.querySelector('slot')?.assignedElements({ flatten: true }) ?? [];
    if (elements.length === 0) {
      __privateGet(this, _internals).states.add('empty');
    } else {
      __privateGet(this, _internals).states.delete('empty');
    }
    for (const element of elements) {
      if (element instanceof HTMLElement) {
        element.style.visibility = '';
        element.style.position = '';
      }
    }
    this.items = mapElementsToItems(elements);
    __privateSet(this, _needsMeasurement, true);
    __privateSet(this, _fitContent, false);
    __privateSet(this, _lastHostWidth, 0);
    if (this.parentElement) {
      __privateGet(this, _resizeObserver).unobserve(this.parentElement);
    }
    __privateMethod(this, _ToolBar_instances, measureItems_fn).call(this);
    __privateMethod(this, _ToolBar_instances, onResize_fn).call(this);
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
  forceRecalculation() {
    if (__privateGet(this, _forceRecalculationTimeout)) {
      clearTimeout(__privateGet(this, _forceRecalculationTimeout));
    }
    __privateSet(
      this,
      _forceRecalculationTimeout,
      setTimeout(() => {
        const firstHidden = this.items.find(item => !item.visible);
        if (!firstHidden) {
          return;
        }
        __privateSet(this, _needsMeasurement, true);
        __privateMethod(this, _ToolBar_instances, onResize_fn).call(this);
      }, 200)
    );
  }
};
_forceRecalculationTimeout = new WeakMap();
_internals = new WeakMap();
_mutationObserver = new WeakMap();
_fitContent = new WeakMap();
_lastHostWidth = new WeakMap();
_needsMeasurement = new WeakMap();
_resizeObserver = new WeakMap();
_rovingTabindexController = new WeakMap();
_widths = new WeakMap();
_ToolBar_instances = new WeakSet();
onResize_fn = function () {
  if (!this.wrapper) {
    return;
  }
  const gap = parseFloat(getComputedStyle(this.wrapper).getPropertyValue('gap')) || 0;
  revealAllItems(this.items);
  if (__privateGet(this, _needsMeasurement) || __privateGet(this, _widths).length === 0) {
    __privateMethod(this, _ToolBar_instances, measureItems_fn).call(this);
  }
  if (
    __privateGet(this, _needsMeasurement) ||
    __privateGet(this, _widths).length === 0 ||
    __privateGet(this, _widths).length !== this.items.length
  ) {
    return;
  }
  if (
    !__privateGet(this, _fitContent) &&
    this.parentElement &&
    isFitContent(this, this.parentElement)
  ) {
    __privateSet(this, _fitContent, true);
    __privateGet(this, _resizeObserver).observe(this.parentElement);
  }
  let availableWidth;
  if (__privateGet(this, _fitContent)) {
    availableWidth = measureConstrainedWidth(this, __privateGet(this, _internals));
  } else {
    availableWidth = getContentBoxWidth(this);
  }
  this.menuButton?.removeAttribute('all-items-hidden');
  const menuButtonWidth = measureMenuButtonWidth(this.wrapper, this.menuButton ?? void 0, gap);
  availableWidth = Math.ceil(availableWidth);
  __privateSet(this, _lastHostWidth, Math.ceil(getContentBoxWidth(this)));
  calculateVisibility(
    this.items,
    __privateGet(this, _widths),
    availableWidth,
    gap,
    menuButtonWidth
  );
  const hiddenItems = this.items.filter(item => !item.visible),
    allItemsHidden = hiddenItems.length === this.items.length;
  this.menuButton?.toggleAttribute('hidden', hiddenItems.length === 0);
  this.menuButton?.toggleAttribute('all-items-hidden', allItemsHidden);
  applyVisibility(this.items);
  this.menuItems = hiddenItems;
  if (this.menuItems.length > 0 && this.parentElement) {
    __privateGet(this, _resizeObserver).observe(this.parentElement);
  } else if (
    this.menuItems.length === 0 &&
    !__privateGet(this, _fitContent) &&
    this.parentElement
  ) {
    __privateGet(this, _resizeObserver).unobserve(this.parentElement);
  }
  this.requestUpdate();
  __privateGet(this, _rovingTabindexController).clearElementCache();
};
onSlotChange_fn = function (event) {
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
};
/**
 * Check if an element is disabled. For menu buttons, the element might be the internal sl-button
 * from the shadow DOM, so we need to find the original item to get the correct disabled state.
 */
isDisabled_fn = function (el) {
  const isNativelyDisabled =
    el.hasAttribute('disabled') ||
    (el instanceof Button || el instanceof MenuButton ? el.disabled : false);
  if (isNativelyDisabled) {
    return true;
  }
  const item = __privateMethod(this, _ToolBar_instances, findItemForElement_fn).call(this, el);
  if (item && 'disabled' in item && item.disabled) {
    return true;
  }
  const parentMenuButton = el.closest('sl-menu-button');
  if (parentMenuButton && parentMenuButton !== el) {
    if (parentMenuButton.hasAttribute('disabled') || parentMenuButton.disabled) {
      return true;
    }
  }
  return false;
};
/** Get all focusable elements including visible toolbar items and overflow menu button. */
getFocusableElements_fn = function () {
  const visibleItems = (this.items || [])
    .filter(item => item.visible)
    .map(item => {
      if (item.element instanceof MenuButton) {
        return item.element.renderRoot.querySelector('sl-button');
      }
      return item.element;
    })
    .filter(el => el !== null);
  if (!this.menuButton || this.menuItems.length === 0) {
    return visibleItems;
  }
  const menuButtonElement = this.menuButton?.renderRoot?.querySelector('sl-button');
  return menuButtonElement ? [...visibleItems, menuButtonElement] : visibleItems;
};
/**
 * Find the toolbar item associated with an element. Handles both direct elements and internal
 * buttons from menu buttons.
 */
findItemForElement_fn = function (el) {
  return this.items?.find(item => {
    if (item.element === el) {
      return true;
    } else if (item.element instanceof MenuButton) {
      const internalButton = item.element.renderRoot.querySelector('sl-button');
      return internalButton === el;
    }
    return false;
  });
};
measureItems_fn = function () {
  if (this.getClientRects().length === 0) {
    __privateSet(this, _needsMeasurement, true);
    return;
  }
  revealAllItems(this.items);
  void this.offsetHeight;
  const widths = measureItemWidths(this.items);
  if (widths) {
    __privateSet(this, _widths, widths);
  }
  __privateSet(this, _needsMeasurement, !widths);
};
/** @internal */
ToolBar.styles = styles;
__decorateClass([property({ reflect: true })], ToolBar.prototype, 'align', 2);
__decorateClass([property({ type: Boolean, reflect: true })], ToolBar.prototype, 'contained', 2);
__decorateClass([property({ type: Boolean, reflect: true })], ToolBar.prototype, 'disabled', 2);
__decorateClass([property()], ToolBar.prototype, 'fill', 2);
__decorateClass([property({ type: Boolean })], ToolBar.prototype, 'inverted', 2);
__decorateClass([state()], ToolBar.prototype, 'items', 2);
__decorateClass([query('sl-menu-button')], ToolBar.prototype, 'menuButton', 2);
__decorateClass([state()], ToolBar.prototype, 'menuItems', 2);
__decorateClass([query('[part="wrapper"]')], ToolBar.prototype, 'wrapper', 2);
ToolBar = __decorateClass([localized()], ToolBar);
//# sourceMappingURL=tool-bar.js.map
