import { type RangeChangedEvent } from '@lit-labs/virtualizer';
import { type VirtualizerHostElement, virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, ObserveAttributesMixin, RovingTabindexController, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { Skeleton } from '@sl-design-system/skeleton';
import { Spinner } from '@sl-design-system/spinner';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { TreeDataSource, type TreeDataSourceNode } from './tree-data-source.js';
import { TreeNode } from './tree-node.js';
import styles from './tree.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TreeItemRenderer<T = any> = (item: TreeDataSourceNode<T>) => TemplateResult;

/**
 * A tree component. Use this if you have hierarchical data that you want
 * to visualize.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Tree<T = any> extends ObserveAttributesMixin(ScopedElementsMixin(LitElement), [
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
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'aria-label', 'aria-labelledby'];
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The data model for the tree. */
  #dataSource?: TreeDataSource<T>;

  /** Manage keyboard navigation between tabs. */
  #rovingTabindexController = new RovingTabindexController<TreeNode<T>>(this, {
    focusInIndex: (elements: Array<TreeNode<T>>) => elements.findIndex(el => !el.disabled),
    elements: () => Array.from(this.shadowRoot?.querySelectorAll('sl-tree-node') ?? []),
    isFocusableElement: (el: TreeNode<T>) => !el.disabled
  });

  /** The virtualizer instance. */
  #virtualizer?: VirtualizerHostElement[typeof virtualizerRef];

  get dataSource() {
    return this.#dataSource;
  }

  /** The model for the tree. */
  @property({ attribute: false })
  set dataSource(dataSource: TreeDataSource<T> | undefined) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.#onUpdate);
    }

    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);
    this.#dataSource?.update();
  }

  /** Hides the indentation guides when set. */
  @property({ type: Boolean, attribute: 'hide-guides' }) hideGuides?: boolean;

  /**
   * Use this if you want to wait until lit-virtualizer has finished the rendering
   * the tree nodes. This can be useful in unit tests for example.
   */
  get layoutComplete() {
    return this.#virtualizer?.layoutComplete ?? Promise.resolve();
  }

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

  override connectedCallback(): void {
    super.connectedCallback();

    /** Role `treegrid` is used instead of `tree`,
     * because `tree` role is not fully accessible without `group` role inside,
     * and we cannot implement groups due to virtualizer usage
     * */
    // this.role = 'treegrid';
  }

  override async firstUpdated(changes: PropertyValues<this>): Promise<void> {
    super.firstUpdated(changes);

    const wrapper = this.renderRoot.querySelector('[part="wrapper"]') as VirtualizerHostElement;
    this.#virtualizer = wrapper[virtualizerRef];

    this.setAttributesTarget(wrapper);

    await this.layoutComplete;

    if (this.dataSource?.selection.size) {
      const node = this.dataSource.selection.keys().next().value as TreeDataSourceNode<T>;

      this.scrollToNode(node, { block: 'center' });
    }

    // if (this.dataSource?.items) {
    //   // this.setAttribute('aria-rowcount', `${this.dataSource?.items.length}` || '-1');
    //   wrapper?.setAttribute('aria-rowcount', `${this.dataSource?.items.length}` || '-1'); // TODO: we don't have total amount of items
    // }

    if (this.dataSource?.nodes) {
      // this.setAttribute('aria-owns', this.dataSource.nodes.map(child => child.id).join(' ') || '');
      wrapper?.setAttribute('aria-owns', this.dataSource?.nodes.map(child => String(child.id)).join(' ') || '');
      wrapper?.setAttribute('aria-controls', this.dataSource?.nodes.map(child => String(child.id)).join(' ') || '');
    }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('dataSource')) {
      const wrapper = this.renderRoot.querySelector('[part="wrapper"]');

      if (this.dataSource?.selects === 'multiple') {
        // this.setAttribute('aria-multiselectable', 'true');
        wrapper?.setAttribute('aria-multiselectable', 'true');
      } else if (this.dataSource?.selects === 'single') {
        // this.setAttribute('aria-multiselectable', 'false');
        wrapper?.setAttribute('aria-multiselectable', 'false');
      } else {
        // this.removeAttribute('aria-multiselectable');
        wrapper?.removeAttribute('aria-multiselectable');
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
    /** Role `treegrid` is used instead of `tree`,
     * because `tree` role is not fully accessible without `group` role inside,
     * and we cannot implement groups due to Virtualizer usage.
     * */
    return html`
      <div
        @keydown=${this.#onKeydown}
        @rangeChanged=${this.#onRangeChanged}
        @sl-select=${this.#onSelect}
        part="wrapper"
        role="treegrid"
      >
        ${virtualize({
          items: this.dataSource?.items,
          keyFunction: (item: TreeDataSourceNode<T>) => item.id,
          renderItem: (item: TreeDataSourceNode<T>) => this.renderItem(item)
        })}
      </div>
    `;
  }

  renderItem(item: TreeDataSourceNode<T>): TemplateResult {
    const icon = item.expanded ? item.expandedIcon : item.icon;

    /**
     * Aria-label is added to improve a11y for Safari and VO - without it the content of each row is not being read.
     * Maybe we will be able to use in the future: ariaControlsElements and/or ariaOwnsElements insteda of aria-owns and aria-controls.
     * */
    return html`
      <sl-tree-node
        id=${item.id}
        @sl-change=${(event: SlChangeEvent<boolean>) => this.#onChange(event, item)}
        @sl-toggle=${() => this.#onToggle(item)}
        ?checked=${this.dataSource?.selects === 'multiple' && item.selected}
        ?expandable=${item.expandable}
        ?expanded=${item.expanded}
        ?hide-guides=${this.hideGuides}
        ?indeterminate=${item.indeterminate}
        ?last-node-in-level=${item.lastNodeInLevel}
        ?selected=${this.dataSource?.selects === 'single' && item.selected}
        .level=${item.level}
        .node=${item}
        .selects=${this.dataSource?.selects}
        .type=${item.type}
        aria-controls=${item.children?.map(child => String(child.id)).join(' ') || `${String(item.id)}-cell`}
        aria-label=${item.label}
        aria-level=${item.level + 1}
        aria-owns=${item.children?.map(child => String(child.id)).join(' ') || `${String(item.id)}-cell`}
        aria-setsize=${item.parent ? item.parent.children?.length : this.dataSource?.size}
        aria-posinset=${item.parent?.children ? item.parent.children?.indexOf(item) + 1 : 1}
        aria-rowindex=${this.dataSource ? this.dataSource.items?.indexOf(item) + 1 : 1}
      >
        ${this.renderer?.(item) ??
        html`
          ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
          <span>${item.label}</span>
        `}
      </sl-tree-node>
    `;
  }

  scrollToNode(node: TreeDataSourceNode<T>, options?: ScrollIntoViewOptions): void {
    const index = this.dataSource?.items.indexOf(node) ?? -1;
    if (index !== -1) {
      this.#virtualizer?.element(index)?.scrollIntoView(options);
    }
  }

  #onChange(event: SlChangeEvent<boolean>, node: TreeDataSourceNode<T>): void {
    if (event.detail) {
      this.dataSource?.select(node);
    } else {
      this.dataSource?.deselect(node);
    }

    this.selectEvent.emit(node);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (!(event.target instanceof TreeNode)) {
      return;
    }

    // Expands all siblings that are at the same level as the current node.
    // See https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
    if (event.key === '*') {
      event.preventDefault(); // TODO: breaks tab when action buttons are visible?

      const treeNode = event.target.node as TreeDataSourceNode<T>,
        siblings = treeNode.parent?.children ?? this.dataSource?.items;

      if (Array.isArray(siblings)) {
        siblings
          .filter(sibling => sibling !== treeNode && sibling.expandable)
          .forEach(sibling => this.dataSource?.expand(sibling, false));
      }

      this.dataSource?.update();
    } else if (event.key === 'ArrowLeft' && !event.target.expanded) {
      event.preventDefault();

      let parent = event.target.previousElementSibling as TreeNode<T> | null;
      while (parent && parent.level === event.target.level) {
        parent = parent.previousElementSibling as TreeNode<T> | null;
      }

      if (parent) {
        this.#rovingTabindexController.focusToElement(parent);
      }
    }
  }

  #onRangeChanged(event: RangeChangedEvent): void {
    // Give lit-virtualizer time to finish rendering the tree nodes
    requestAnimationFrame(() => {
      this.#rovingTabindexController.updateWithVirtualizer(
        { elements: () => Array.from(this.renderRoot.querySelectorAll('sl-tree-node')) },
        event
      );
    });
  }

  #onSelect(event: SlSelectEvent<TreeDataSourceNode<T>>): void {
    event.preventDefault();
    event.stopPropagation();

    this.dataSource?.select(event.detail);
    this.selectEvent.emit(event.detail);
  }

  #onToggle(node: TreeDataSourceNode<T>): void {
    this.dataSource?.toggle(node);
  }

  #onUpdate = (): void => {
    this.requestUpdate('dataSource');
  };
}
