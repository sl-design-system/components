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
import { ObserveAttributesMixin, event } from '@sl-design-system/shared';
import { Skeleton } from '@sl-design-system/skeleton';
import { Spinner } from '@sl-design-system/spinner';
import { VirtualizerController } from '@sl-design-system/virtual-list';
import { LitElement, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { TreeNode } from './tree-node.js';
import styles from './tree.scss.js';
export class Tree extends ObserveAttributesMixin(ScopedElementsMixin(LitElement), [
  'aria-describedby',
  'aria-label',
  'aria-labelledby'
]) {
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-skeleton': Skeleton,
      'sl-spinner': Spinner,
      'sl-tree-node': TreeNode
    };
  }
  static {
    /** @internal */
    this.shadowRootOptions = {
      ...LitElement.shadowRootOptions,
      delegatesFocus: true
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  /** The data model for the tree. */
  #dataSource;
  /** The index of the currently focused node. */
  #indexOfFocusedNode = 0;
  /** Manages the virtual list of tree nodes. */
  #virtualizer = new VirtualizerController(this, {
    count: this.dataSource?.items.length ?? 0,
    estimateSize: () => 32,
    // this doesn't need to be exact
    gap: 2,
    // var(--sl-size-025)
    overscan: 3,
    // render a few extra nodes outside of the viewport
    getItemKey: index => {
      return this.dataSource?.items?.at(index)?.id?.toString() ?? index;
    }
  });
  get dataSource() {
    return this.#dataSource;
  }
  set dataSource(dataSource) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.#onUpdate);
      this.#dataSource.removeEventListener('sl-selection-change', this.#onSelectionChange);
    }
    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);
    this.#dataSource?.addEventListener('sl-selection-change', this.#onSelectionChange);
    this.#dataSource?.update();
  }
  connectedCallback() {
    super.connectedCallback();
    const selected = this.dataSource?.items.find(item => item.selected);
    if (selected) {
      this.#indexOfFocusedNode = this.dataSource?.items.indexOf(selected) ?? 0;
    }
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    this.setAttributesTarget(this.wrapper);
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('dataSource')) {
      if (this.dataSource?.multiple) {
        this.wrapper?.setAttribute('aria-multiselectable', 'true');
      } else {
        this.wrapper?.setAttribute('aria-multiselectable', 'false');
      }
    }
    if (changes.has('scopedElements') && this.scopedElements) {
      for (const [tagName, klass] of Object.entries(this.scopedElements)) {
        if (!this.registry?.get(tagName)) {
          this.registry?.define(tagName, klass);
        }
      }
    }
  }
  render() {
    const rootIds = this.dataSource?.nodes.map(child => String(child.id)).join(' '),
      virtualizer = this.#virtualizer.instance,
      virtualItems = virtualizer.getVirtualItems();
    return html`
      <div
        aria-controls=${ifDefined(rootIds)}
        aria-owns=${ifDefined(rootIds)}
        part="wrapper"
        role="treegrid"
        style="block-size: ${virtualizer.getTotalSize()}px">
        <div
          class="starter"
          style="translate: 0px ${(virtualItems[0]?.start ?? 0) - (virtualizer.options.scrollMargin ?? 0)}px">
          ${repeat(
            virtualItems,
            virtualItem => virtualItem.key,
            virtualItem => {
              const item = this.dataSource.items[virtualItem.index],
                icon = item.expanded ? item.expandedIcon : item.icon;
              return html`
                <sl-tree-node
                  @sl-change=${event2 => this.#onChange(event2, item)}
                  @sl-select=${this.#onSelect}
                  @sl-toggle=${() => this.#onToggle(item)}
                  @keydown=${this.#onKeydown}
                  data-index=${virtualItem.index}
                  ${ref(virtualizer.measureElement)}
                  ?expandable=${item.expandable}
                  ?expanded=${item.expanded}
                  ?indeterminate=${item.indeterminate}
                  ?last-node-in-level=${item.lastNodeInLevel}
                  ?multiple=${this.dataSource?.multiple}
                  ?selectable=${item.selectable}
                  ?selected=${item.selected}
                  .level=${item.level}
                  .levelGuides=${this.hideGuides ? void 0 : item.levelGuides}
                  .node=${item}
                  .type=${item.type}
                  aria-controls=${ifDefined(
                    item.children?.map(child => String(child.id)).join(' ')
                  )}
                  aria-description=${ifDefined(item.description || void 0)}
                  aria-label=${item.label}
                  aria-level=${item.level + 1}
                  aria-owns=${ifDefined(item.children?.map(child => String(child.id)).join(' '))}
                  aria-posinset=${item.parent?.children ? (item.parent.children?.indexOf(item) ?? -1) + 1 : (this.dataSource?.nodes.indexOf(item) ?? -1) + 1}
                  aria-rowindex=${this.dataSource ? this.dataSource.items?.indexOf(item) + 1 : 1}
                  aria-setsize=${ifDefined(
                    item.parent ? item.parent.children?.length : this.dataSource?.size
                  )}
                  id=${item.id}
                  tabindex=${virtualItem.index === this.#indexOfFocusedNode ? '0' : '-1'}>
                  ${
                    this.renderer?.(item) ??
                    html`
                      ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
                      <span>${item.label}</span>
                    `
                  }
                </sl-tree-node>
              `;
            }
          )}
        </div>
      </div>
    `;
  }
  #onChange(event2, node) {
    if (event2.detail) {
      this.dataSource?.select(node);
    } else {
      this.dataSource?.deselect(node);
    }
    this.selectEvent.emit(node);
  }
  #onKeydown(event2) {
    const target = event2.currentTarget;
    if (event2.key === '*') {
      event2.preventDefault();
      const treeNode = target.node,
        siblings = treeNode.parent?.children ?? this.dataSource?.items;
      if (Array.isArray(siblings)) {
        siblings
          .filter(sibling => sibling !== treeNode && sibling.expandable)
          .forEach(sibling => this.dataSource?.expand(sibling, false));
      }
      this.dataSource?.update();
    } else if (event2.key === 'ArrowDown' || event2.key === 'ArrowUp') {
      event2.preventDefault();
      const direction = event2.key === 'ArrowDown' ? 1 : -1;
      let nextIndex = parseInt(target.dataset['index'] ?? '0') + direction;
      if (nextIndex < 0) {
        nextIndex = this.dataSource.items.length - 1;
      } else if (nextIndex >= this.dataSource.items.length) {
        nextIndex = 0;
      }
      this.#scrollAndFocusNode(nextIndex);
    } else if (event2.key === 'Home' || event2.key === 'End') {
      event2.preventDefault();
      this.#scrollAndFocusNode(event2.key === 'Home' ? 0 : this.dataSource.items.length - 1);
    } else if (event2.key === 'ArrowLeft' && !target.expanded) {
      event2.preventDefault();
      let parent = target.previousElementSibling;
      while (parent && parent.level === target.level) {
        parent = parent.previousElementSibling;
      }
      if (parent) {
        this.#scrollAndFocusNode(parseInt(parent.dataset['index'] ?? '0'));
      }
    } else if (event2.key === 'ArrowRight') {
      event2.preventDefault();
      const nextElement = target.nextElementSibling;
      if (nextElement && nextElement.level > target.level) {
        this.#scrollAndFocusNode(parseInt(nextElement.dataset['index'] ?? '0'));
      }
    }
  }
  #onSelect(event2) {
    event2.preventDefault();
    event2.stopPropagation();
    this.#scrollAndFocusNode(this.dataSource?.items.indexOf(event2.detail) ?? 0);
    this.dataSource?.select(event2.detail);
    this.selectEvent.emit(event2.detail);
  }
  #onSelectionChange = () => {
    this.requestUpdate();
  };
  #onToggle(node) {
    this.dataSource?.toggle(node);
  }
  #onUpdate = () => {
    const count = this.dataSource?.items.length ?? 0;
    this.#virtualizer.updateOptions({ count });
    if (this.#indexOfFocusedNode >= count) {
      this.#indexOfFocusedNode = 0;
    }
    this.requestUpdate();
  };
  #scrollAndFocusNode(index) {
    this.#virtualizer.instance.scrollToIndex(index);
    const currentlyFocusedNode = this.renderRoot.querySelector(
      `[data-index="${this.#indexOfFocusedNode}"]`
    );
    if (currentlyFocusedNode) {
      currentlyFocusedNode.tabIndex = -1;
    }
    requestAnimationFrame(() => {
      const nodeToFocus = this.renderRoot.querySelector(`[data-index="${index}"]`);
      if (nodeToFocus) {
        nodeToFocus.tabIndex = 0;
        nodeToFocus.focus();
        this.#indexOfFocusedNode = index;
      }
    });
  }
}
__decorateClass([property({ attribute: false })], Tree.prototype, 'dataSource', 1);
__decorateClass(
  [property({ type: Boolean, attribute: 'hide-guides' })],
  Tree.prototype,
  'hideGuides',
  2
);
__decorateClass([property({ attribute: false })], Tree.prototype, 'renderer', 2);
__decorateClass([property({ attribute: false })], Tree.prototype, 'scopedElements', 2);
__decorateClass([event({ name: 'sl-select' })], Tree.prototype, 'selectEvent', 2);
__decorateClass([query('[part="wrapper"]')], Tree.prototype, 'wrapper', 2);
//# sourceMappingURL=tree.js.map
