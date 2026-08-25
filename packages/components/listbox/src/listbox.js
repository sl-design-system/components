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
import { getStringByPath, getValueByPath } from '@sl-design-system/shared';
import { VirtualList } from '@sl-design-system/virtual-list';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './listbox.scss.js';
import { OptionGroupHeader } from './option-group-header.js';
import { OptionGroup } from './option-group.js';
import { Option } from './option.js';
let nextUniqueId = 0;
export class Listbox extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements() {
    return {
      'sl-virtual-list': VirtualList,
      'sl-option': Option,
      'sl-option-group-header': OptionGroupHeader
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  /** The virtual list instance when the `options` or `items` property is set. */
  #virtualizer;
  /** Cache mapping each option id to its 0-based flattened position (excludes group headers). */
  #flattenedPositionCache;
  /** Items reference used when the flattened cache was last built. */
  #flattenedPositionCacheItems;
  /** Cache version matching the items version when the cache was last built. */
  #flattenedPositionCacheVersion = -1;
  /** Monotonically increasing version, incremented whenever `items` changes. */
  #itemsVersion = 0;
  /** Total number of option items in the last built cache. */
  #flattenedSetSize = 0;
  /** Cache mapping items array index to flattened option position, or -1 for non-option rows. */
  #flattenedIndexCache;
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listbox');
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    if (this.items && this.items.length > 0) {
      this.#updateVirtualConstraintAttribute();
    }
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (
      changes.has('options') ||
      changes.has('optionGroupPath') ||
      changes.has('optionLabelPath') ||
      changes.has('optionSelectedPath') ||
      changes.has('optionValuePath')
    ) {
      if (this.options) {
        this.items = this.#prepareOptions(this.options);
        this.#itemsVersion++;
        this.#updateVirtualConstraintAttribute();
      } else if (changes.get('options')) {
        this.items = void 0;
        this.#itemsVersion++;
        this.#flattenedPositionCache = void 0;
        this.#flattenedPositionCacheItems = void 0;
        this.#flattenedIndexCache = void 0;
        this.#flattenedSetSize = 0;
        this.removeAttribute('data-virtual-unconstrained');
      }
    }
    if (changes.has('items')) {
      this.#itemsVersion++;
      if (!this.items) {
        this.#flattenedPositionCache = void 0;
        this.#flattenedPositionCacheItems = void 0;
        this.#flattenedIndexCache = void 0;
        this.#flattenedSetSize = 0;
      }
      this.#updateVirtualConstraintAttribute();
    }
  }
  #updateVirtualConstraintAttribute() {
    this.removeAttribute('data-virtual-unconstrained');
    const hasInlineHeightConstraint = !!(
      this.style.height ||
      this.style.blockSize ||
      this.style.maxHeight ||
      this.style.maxBlockSize
    );
    let hasComputedHeightConstraint = false;
    if (!hasInlineHeightConstraint) {
      const computed = getComputedStyle(this);
      hasComputedHeightConstraint =
        computed.maxHeight !== 'none' || computed.maxBlockSize !== 'none';
    }
    if (
      this.items &&
      this.items.length > 0 &&
      !hasInlineHeightConstraint &&
      !hasComputedHeightConstraint
    ) {
      this.setAttribute('data-virtual-unconstrained', '');
    }
  }
  updated(changes) {
    if (changes.has('emphasis')) {
      this.#propagateEmphasis();
    }
    const itemsChanged = changes.has('options') || changes.has('items');
    if (itemsChanged) {
      if (this.items) {
        const renderer = this.renderer;
        this.#virtualizer ||= this.shadowRoot.createElement('sl-virtual-list');
        this.#virtualizer.setAttribute('data-virtual-list', '');
        this.#virtualizer.renderInLightDom = true;
        this.#virtualizer.items = this.items ?? [];
        this.#virtualizer.scrollMargin = 0;
        const gapValue = parseFloat(getComputedStyle(this).gap);
        this.#virtualizer.gap = Number.isFinite(gapValue) ? gapValue : 0;
        this.#virtualizer.overscan = 3;
        this.#virtualizer.renderItem = (item, index) =>
          renderer ? renderer(item, index) : this.#renderItem(item, index);
        if (!this.#virtualizer.parentElement) {
          this.prepend(this.#virtualizer);
        }
      } else if (changes.get('items') || changes.get('options')) {
        this.#virtualizer?.remove();
        this.#virtualizer = void 0;
      }
    }
    if (changes.has('renderer') && this.#virtualizer) {
      const renderer = this.renderer;
      if (renderer) {
        this.#virtualizer.renderItem = (item, index) => renderer(item, index);
      } else {
        this.#virtualizer.renderItem = (item, index) => this.#renderItem(item, index);
      }
    }
  }
  render() {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }
  /**
   * Request a layout update for the virtual list. Call this method after the listbox becomes
   * visible (for example, when a popover opens) to ensure item positions are measured correctly.
   */
  async requestLayout() {
    if (this.#virtualizer && this.items) {
      await this.#virtualizer.requestLayout();
    }
  }
  /**
   * Scrolls to the item at the specified index.
   *
   * @remarks
   *   **Indexing semantics differ between rendering modes:**
   *
   *   - **Virtualized (via `options` or `items` properties):** Index refers to the `items` array,
   *     which may include both options and option-group headers. Only `block` and `behavior`
   *     options are supported; `inline` is ignored.
   *   - **Slotted (declarative `<sl-option>` elements):** Index refers only to visible `<sl-option>`
   *     elements, excluding group headers and hidden options.
   *
   * @param index - The zero-based index into the items/options array (see remarks for details)
   * @param options - Scroll options
   */
  scrollToIndex(index, options) {
    if (!Number.isInteger(index) || index < 0) {
      return;
    }
    if (this.#virtualizer) {
      if (!this.items || index >= this.items.length) {
        return;
      }
      const alignMap = {
          center: 'center',
          end: 'end',
          nearest: 'auto',
          start: 'start'
        },
        block = options?.block ?? 'start',
        behavior = options?.behavior === 'instant' ? 'auto' : options?.behavior;
      this.#virtualizer.scrollToIndex(index, {
        align: alignMap[block],
        behavior
      });
    } else {
      const visibleOptions = Array.from(this.querySelectorAll('sl-option')).filter(
        el => el.style.display !== 'none'
      );
      if (index >= visibleOptions.length) {
        return;
      }
      visibleOptions[index]?.scrollIntoView(options);
    }
  }
  /**
   * Applies flattened accessibility metadata to options.
   *
   * Kept public so composed consumers can trigger deterministic timing when options are projected
   * through nested slots.
   */
  applyFlattenedOptionAccessibility(options) {
    this.#applyFlattenedOptionAccessibility(options);
  }
  /**
   * Returns the 0-based flattened position of an option item among all option items (group headers
   * are excluded). Returns -1 if the item is a group header or is not in `items`.
   *
   * @internal Used by virtual-list consumers (e.g. combobox) so they don't need a duplicate cache.
   */
  getFlattenedPosition(item) {
    if (!this.items) return -1;
    if (this.#shouldRebuildFlattenedPositionCache()) {
      this.#buildFlattenedPositionCache();
    }
    return this.#flattenedPositionCache.get(item.id) ?? -1;
  }
  /**
   * Returns the total number of option items (group headers excluded) in the current `items` array.
   *
   * @internal Companion to `getFlattenedPosition`.
   */
  getFlattenedSetSize() {
    if (!this.items) return 0;
    if (this.#shouldRebuildFlattenedPositionCache()) {
      this.#buildFlattenedPositionCache();
    }
    return this.#flattenedSetSize;
  }
  #shouldRebuildFlattenedPositionCache() {
    return (
      this.#flattenedPositionCacheVersion !== this.#itemsVersion ||
      this.#flattenedPositionCacheItems !== this.items ||
      !this.#flattenedPositionCache
    );
  }
  #buildFlattenedPositionCache() {
    this.#flattenedPositionCache = /* @__PURE__ */ new Map();
    this.#flattenedPositionCacheItems = this.items;
    this.#flattenedPositionCacheVersion = this.#itemsVersion;
    const items = this.items ?? [];
    this.#flattenedIndexCache = new Array(items.length).fill(-1);
    let position = 0;
    items.forEach((i, index) => {
      if ('option' in i) {
        this.#flattenedPositionCache.set(i.id, position++);
        this.#flattenedIndexCache[index] = position - 1;
      }
    });
    this.#flattenedSetSize = position;
  }
  #getFlattenedPositionByIndex(index) {
    if (!this.items || index < 0 || index >= this.items.length) {
      return -1;
    }
    if (this.#shouldRebuildFlattenedPositionCache() || !this.#flattenedIndexCache) {
      this.#buildFlattenedPositionCache();
    }
    return this.#flattenedIndexCache[index] ?? -1;
  }
  #prepareOptions(options) {
    if (this.optionGroupPath) {
      const groups = Object.groupBy(options, option =>
        getStringByPath(option, this.optionGroupPath)
      );
      return Object.keys(groups).reduce((acc, group) => {
        return [
          ...acc,
          {
            id: `sl-listbox-option-group-${nextUniqueId++}`,
            label: group
          },
          ...groups[group].map(option => this.#prepareOption(option, group))
        ];
      }, []);
    } else {
      return options.map(option => this.#prepareOption(option));
    }
  }
  #prepareOption(option, group) {
    const label = this.optionLabelPath
      ? getStringByPath(option, this.optionLabelPath)
      : option.toString();
    return {
      group,
      id: `sl-listbox-option-${nextUniqueId++}`,
      label,
      option,
      selected: this.optionSelectedPath ? !!getValueByPath(option, this.optionSelectedPath) : false,
      value: this.optionValuePath ? getValueByPath(option, this.optionValuePath) : option
    };
  }
  #propagateEmphasis() {
    const slot = this.renderRoot.querySelector('slot');
    slot?.assignedElements({ flatten: true }).forEach(el => {
      if (el instanceof Option) {
        el.emphasis = this.emphasis;
      } else if (el instanceof OptionGroup) {
        el.querySelectorAll('sl-option').forEach(o => (o.emphasis = this.emphasis));
      }
    });
  }
  #onSlotChange() {
    this.#propagateEmphasis();
    const options = Array.from(this.querySelectorAll('sl-option')).filter(
      el => el instanceof Option
    );
    this.#applyFlattenedOptionAccessibility(options);
  }
  #applyFlattenedOptionAccessibility(options) {
    const metadata = options.map(option => ({
      group: option.closest('sl-option-group')?.label,
      label: this.#getOptionLabel(option),
      option
    }));
    metadata.forEach((item, index) => {
      this.#applyOptionAccessibility(item.option, {
        group: item.group,
        label: item.label,
        position: index + 1,
        setSize: metadata.length,
        selected: item.option.selected
      });
    });
    const processedOptions = new Set(metadata.map(m => m.option));
    this.querySelectorAll('sl-option').forEach(option => {
      if (
        !processedOptions.has(option) &&
        option.getAttribute('data-generated-aria-label') === 'true'
      ) {
        const currentGroup = option.closest('sl-option-group')?.label;
        if (!currentGroup) {
          option.removeAttribute('aria-label');
          option.removeAttribute('data-generated-aria-label');
        }
      }
    });
  }
  #getOptionLabel(option) {
    const assignedNodes =
      option.shadowRoot?.querySelector('slot')?.assignedNodes({ flatten: true }) ??
      Array.from(option.childNodes);
    const label = assignedNodes
      .map(node => node.textContent || '')
      .join('')
      .trim();
    return label || option.innerText?.trim() || option.textContent?.trim() || '';
  }
  #renderItem(item, index) {
    if ('option' in item) {
      const element = this.shadowRoot.createElement('sl-option');
      element.emphasis = this.emphasis;
      element.id = item.id;
      element.innerText = item.label;
      element.selected = item.selected;
      element.value = item.value;
      const flattenedPosition = this.getFlattenedPosition(item);
      const resolvedFlattenedPosition =
        flattenedPosition !== -1 ? flattenedPosition : this.#getFlattenedPositionByIndex(index);
      if (resolvedFlattenedPosition !== -1) {
        this.#applyOptionAccessibility(element, {
          group: item.group,
          label: item.label,
          position: resolvedFlattenedPosition + 1,
          setSize: this.getFlattenedSetSize(),
          selected: item.selected
        });
      }
      return element;
    } else {
      const element = this.shadowRoot.createElement('sl-option-group-header');
      element.divider = index !== 0;
      element.id = item.id;
      element.innerText = item.label;
      return element;
    }
  }
  #applyOptionAccessibility(option, { group, label, position, selected, setSize }) {
    option.setAttribute('aria-posinset', position.toString());
    option.setAttribute('aria-setsize', setSize.toString());
    option.setAttribute('aria-selected', Boolean(selected).toString());
    if (group && label.trim()) {
      option.setAttribute('aria-label', `${label} (${group})`);
      option.setAttribute('data-generated-aria-label', 'true');
    } else {
      if (option.getAttribute('data-generated-aria-label') === 'true') {
        option.removeAttribute('aria-label');
      }
      option.removeAttribute('data-generated-aria-label');
    }
  }
}
__decorateClass([property({ reflect: true })], Listbox.prototype, 'emphasis', 2);
__decorateClass([property({ attribute: false })], Listbox.prototype, 'items', 2);
__decorateClass([property({ type: Array })], Listbox.prototype, 'options', 2);
__decorateClass(
  [property({ attribute: 'option-group-path' })],
  Listbox.prototype,
  'optionGroupPath',
  2
);
__decorateClass(
  [property({ attribute: 'option-label-path' })],
  Listbox.prototype,
  'optionLabelPath',
  2
);
__decorateClass(
  [property({ attribute: 'option-selected-path' })],
  Listbox.prototype,
  'optionSelectedPath',
  2
);
__decorateClass(
  [property({ attribute: 'option-value-path' })],
  Listbox.prototype,
  'optionValuePath',
  2
);
__decorateClass([property({ attribute: false })], Listbox.prototype, 'renderer', 2);
//# sourceMappingURL=listbox.js.map
