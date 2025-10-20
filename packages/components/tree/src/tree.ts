import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, ObserveAttributesMixin, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { Skeleton } from '@sl-design-system/skeleton';
import { Spinner } from '@sl-design-system/spinner';
import { VirtualizerController } from '@sl-design-system/virtual-list';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { TreeDataSource, type TreeDataSourceNode } from './tree-data-source.js';
import { TreeNode } from './tree-node.js';
import styles from './tree.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TreeItemRenderer<T = any> = (item: TreeDataSourceNode<T>) => TemplateResult | undefined;

/**
 * A tree component. Use this if you have hierarchical data that you want
 * to visualize.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Tree<T = any> extends ObserveAttributesMixin(ScopedElementsMixin(LitElement), [
  'aria-describedby',
  'aria-label',
  'aria-labelledby'
]) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-skeleton': Skeleton,
      'sl-spinner': Spinner,
      'sl-tree-node': TreeNode
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The data model for the tree. */
  #dataSource?: TreeDataSource<T>;

  /** The index of the currently focused node. */
  #indexOfFocusedNode: number = 0;

  /** Manages the virtual list of tree nodes. */
  #virtualizer = new VirtualizerController(this, {
    count: this.dataSource?.items.length ?? 0,
    estimateSize: () => 32, // this doesn't need to be exact
    gap: 2, // var(--sl-size-025)
    overscan: 3, // render a few extra nodes outside of the viewport
    getItemKey: (index: number): number | string => {
      return this.dataSource?.items?.at(index)?.id?.toString() ?? index;
    }
  });

  get dataSource() {
    return this.#dataSource;
  }

  /**
   *  The model for the tree.
   *  @type {TreeDataSource<T> | undefined}
   *  */
  @property({ attribute: false })
  set dataSource(dataSource: TreeDataSource<T> | undefined) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.#onUpdate);
      this.#dataSource.removeEventListener('sl-selection-change', this.#onSelectionChange);
    }

    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);
    this.#dataSource?.addEventListener('sl-selection-change', this.#onSelectionChange);
    this.#dataSource?.update();
  }

  /** Hides the indentation guides when set. */
  @property({ type: Boolean, attribute: 'hide-guides' }) hideGuides?: boolean;

  /** Custom renderer function for tree items. */
  @property({ attribute: false }) renderer?: TreeItemRenderer<T>;

  /**
   * The custom elements used for rendering this tree. If you are using a custom renderer
   * to render the tree nodes, any custom elements you use in the renderer need to be specified
   * via this property. Otherwise those custom elements will not initialize, since the tree
   * uses a Scoped Custom Element Registry.
   */
  @property({ attribute: false }) scopedElements?: Record<string, typeof HTMLElement>;

  /** @internal Emits when the user selects a tree node. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<TreeDataSourceNode<T>>>;

  /** @internal */
  @query('[part="wrapper"]') wrapper!: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();

    const selected = this.dataSource?.items.find(item => item.selected);
    if (selected) {
      this.#indexOfFocusedNode = this.dataSource?.items.indexOf(selected) ?? 0;
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.setAttributesTarget(this.wrapper);
  }

  override willUpdate(changes: PropertyValues<this>): void {
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

  override render(): TemplateResult {
    const rootIds = this.dataSource?.nodes.map(child => String(child.id)).join(' '),
      virtualizer = this.#virtualizer.instance,
      virtualItems = virtualizer.getVirtualItems();

    // Use role `treegrid` instead of `tree`; treegrid is a better
    // match for accessibility due to the use of Virtualizer: we can't
    // use a group role to wrap the children of a tree node, because
    // that would mess up the virtualization.
    return html`
      <div
        aria-controls=${ifDefined(rootIds)}
        aria-owns=${ifDefined(rootIds)}
        part="wrapper"
        role="treegrid"
        style="block-size: ${virtualizer.getTotalSize()}px"
      >
        <div class="starter" style="translate: 0px ${virtualItems[0]?.start ?? 0}px">
          ${repeat(
            virtualItems,
            virtualItem => virtualItem.key,
            virtualItem => {
              const item = this.dataSource!.items[virtualItem.index],
                icon = item.expanded ? item.expandedIcon : item.icon;

              /**
               * Aria-label is added to improve a11y for Safari and VO - without it the content of
               * each row is not being read. Maybe we will be able to use in the future: ariaControlsElements
               * and/or ariaOwnsElements instead of aria-owns and aria-controls. Aria-owns and aria-controls
               * are not working properly with shadow DOM boundary, in the future we will need to add
               * ariaControlsElements and ariaOwnsElements to sl-tree-node (for the gridcell inside).
               */
              return html`
                <sl-tree-node
                  @sl-change=${(event: SlChangeEvent<boolean>) => this.#onChange(event, item)}
                  @sl-select=${this.#onSelect}
                  @sl-toggle=${() => this.#onToggle(item)}
                  @keydown=${this.#onKeydown}
                  data-index=${virtualItem.index}
                  ${ref(virtualizer.measureElement) /* must be *after* data-index */}
                  ?expandable=${item.expandable}
                  ?expanded=${item.expanded}
                  ?indeterminate=${item.indeterminate}
                  ?last-node-in-level=${item.lastNodeInLevel}
                  ?multiple=${this.dataSource?.multiple}
                  .level=${item.level}
                  .levelGuides=${this.hideGuides ? undefined : item.levelGuides}
                  .node=${item}
                  .selected=${item.selected}
                  .type=${item.type}
                  aria-controls=${ifDefined(item.children?.map(child => String(child.id)).join(' '))}
                  aria-description=${ifDefined(item.description || undefined)}
                  aria-label=${item.label}
                  aria-level=${item.level + 1}
                  aria-owns=${ifDefined(item.children?.map(child => String(child.id)).join(' '))}
                  aria-posinset=${item.parent?.children
                    ? (item.parent.children?.indexOf(item) ?? -1) + 1
                    : (this.dataSource?.nodes.indexOf(item) ?? -1) + 1}
                  aria-rowindex=${this.dataSource ? this.dataSource.items?.indexOf(item) + 1 : 1}
                  aria-setsize=${ifDefined(item.parent ? item.parent.children?.length : this.dataSource?.size)}
                  id=${item.id}
                  tabindex=${virtualItem.index === this.#indexOfFocusedNode ? '0' : '-1'}
                >
                  ${this.renderer?.(item) ??
                  html`
                    ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
                    <span>${item.label}</span>
                  `}
                </sl-tree-node>
              `;
            }
          )}
        </div>
      </div>
    `;
  }

  #onChange(event: SlChangeEvent<boolean>, node: TreeDataSourceNode<T>): void {
    if (event.detail) {
      this.dataSource?.select(node);
    } else {
      this.dataSource?.deselect(node);
    }

    this.selectEvent.emit(node);
  }

  #onKeydown(event: KeyboardEvent & { target: TreeNode<T> }): void {
    // Expands all siblings that are at the same level as the current node.
    // See https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
    if (event.key === '*') {
      event.preventDefault();

      const treeNode = event.target.node as TreeDataSourceNode<T>,
        siblings = treeNode.parent?.children ?? this.dataSource?.items;

      if (Array.isArray(siblings)) {
        siblings
          .filter(sibling => sibling !== treeNode && sibling.expandable)
          .forEach(sibling => this.dataSource?.expand(sibling, false));
      }

      this.dataSource?.update();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      const direction = event.key === 'ArrowDown' ? 1 : -1;

      let nextIndex = parseInt(event.target.dataset['index'] ?? '0') + direction;
      if (nextIndex < 0) {
        nextIndex = this.dataSource!.items.length - 1;
      } else if (nextIndex >= this.dataSource!.items.length) {
        nextIndex = 0;
      }

      this.#scrollAndFocusNode(nextIndex);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();

      this.#scrollAndFocusNode(event.key === 'Home' ? 0 : this.dataSource!.items.length - 1);
    } else if (event.key === 'ArrowLeft' && !event.target.expanded) {
      event.preventDefault();

      let parent = event.target.previousElementSibling as TreeNode<T> | null;
      while (parent && parent.level === event.target.level) {
        parent = parent.previousElementSibling as TreeNode<T> | null;
      }

      if (parent) {
        this.#scrollAndFocusNode(parseInt(parent.dataset['index'] ?? '0'));
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();

      const nextElement = event.target.nextElementSibling as TreeNode<T> | null;
      if (nextElement && nextElement.level > event.target.level) {
        this.#scrollAndFocusNode(parseInt(nextElement.dataset['index'] ?? '0'));
      }
    }
  }

  #onSelect(event: SlSelectEvent<TreeDataSourceNode<T>>): void {
    event.preventDefault();
    event.stopPropagation();

    this.#scrollAndFocusNode(this.dataSource?.items.indexOf(event.detail) ?? 0);

    this.dataSource?.select(event.detail);
    this.selectEvent.emit(event.detail);
  }

  #onSelectionChange = (): void => {
    this.requestUpdate();
  };

  #onToggle(node: TreeDataSourceNode<T>): void {
    this.dataSource?.toggle(node);
  }

  #onUpdate = (): void => {
    const count = this.dataSource?.items.length ?? 0;

    this.#virtualizer.updateOptions({ count });

    if (this.#indexOfFocusedNode >= count) {
      this.#indexOfFocusedNode = 0;
    }

    this.requestUpdate();
  };

  #scrollAndFocusNode(index: number): void {
    this.#virtualizer.instance.scrollToIndex(index);

    const currentlyFocusedNode = this.renderRoot.querySelector<HTMLElement>(
      `[data-index="${this.#indexOfFocusedNode}"]`
    );
    if (currentlyFocusedNode) {
      currentlyFocusedNode.tabIndex = -1;
    }

    // Wait for the next frame, so the node is rendered and can be focused
    requestAnimationFrame(() => {
      const nodeToFocus = this.renderRoot.querySelector<HTMLElement>(`[data-index="${index}"]`);
      if (nodeToFocus) {
        nodeToFocus.tabIndex = 0;
        nodeToFocus.focus();

        this.#indexOfFocusedNode = index;
      }
    });
  }
}
