import { type RangeChangedEvent } from '@lit-labs/virtualizer';
import { type VirtualizerHostElement, virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, RovingTabindexController, event } from '@sl-design-system/shared';
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
export class Tree<T = any> extends ScopedElementsMixin(LitElement) {
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

  #renderedItems = new Set<string>();

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'tree';
  }

  override async firstUpdated(changes: PropertyValues<this>): Promise<void> {
    super.firstUpdated(changes);

    const wrapper = this.renderRoot.querySelector('[part="wrapper"]') as VirtualizerHostElement;
    this.#virtualizer = wrapper[virtualizerRef];

    await this.layoutComplete;

    if (this.dataSource?.selection.size) {
      const node = this.dataSource.selection.keys().next().value as TreeDataSourceNode<T>;

      this.scrollToNode(node, { block: 'center' });
    }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('dataSource')) {
      this.#renderedItems.clear();

      if (this.dataSource?.selects === 'multiple') {
        this.setAttribute('aria-multiselectable', 'true');
      } else if (this.dataSource?.selects === 'single') {
        this.setAttribute('aria-multiselectable', 'false');
      } else {
        this.removeAttribute('aria-multiselectable');
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
    // this.#renderedItems.clear();

    return html`
      <div
        @keydown=${this.#onKeydown}
        @rangeChanged=${this.#onRangeChanged}
        @sl-select=${this.#onSelect}
        part="wrapper"
      >
        ${virtualize({
          items: this.dataSource?.items,
          keyFunction: (item: TreeDataSourceNode<T>) => item.id,
          renderItem: (item: TreeDataSourceNode<T>) => this.renderGroup(item) //this.renderItem(item)
        })}
      </div>
    `;
  }

  // renderGroup(item: TreeDataSourceNode<T>): TemplateResult {
  //   console.log('item in render group', item, item.children?.length, 'label?', item.label);
  //   // ${item.children?.length && item.level > 0 ?
  //   return html`
  //     ${item.children?.length && item.level > 0
  //       ? html` ${this.renderItem(item)}
  //           <div role="group" class="123">${item.children.map(child => this.renderItem(child))}</div>`
  //       : this.renderItem(item)}
  //   `;
  // }

  renderGroup(item: TreeDataSourceNode<T>): TemplateResult {
    console.log('item in render group', item, item.children?.length, 'label?', item.label);
    console.log('this.#renderedItems', this.#renderedItems);
    if (this.#renderedItems.has(item.id as string)) {
      return html`aaa`; // nothing; // or handle the case where the item is already rendered
    }

    this.#renderedItems.add(item.id as string);

    //   return html`
    //   ${item.children?.length && item.level > 0
    //     ? html` ${this.renderItem(item)}
    //         <div role="group" class="123">${item.children.map(child => this.renderItem(child))}</div>`
    //     : this.renderItem(item)}
    // `;

    //   return html`
    //   ${this.renderItem(item)}
    //   ${item.children?.length && item.level > 0
    //     ? html`<div role="group" class="123">${item.children.map(child => this.renderGroup(child))}</div>`
    //     : nothing}
    // `;

    return html`
      ${this.renderItem(item)}
      ${item.children?.length /*&& item.level > 0*/
        ? html`<div role="group" class="123">${item.children.map(child => this.renderGroup(child))}</div>`
        : nothing}
    `;
  }

  renderItem(item: TreeDataSourceNode<T>): TemplateResult {
    const icon = item.expanded ? item.expandedIcon : item.icon;

    console.log('has children?, item', item, item.children?.length, item.children);

    // TODO: maybe renderGroup first and then renderItem?

    return html`
      ${item.children?.length && item.level > 0 ? html`<div role="group" class="123"></div>` : nothing}
      <sl-tree-node
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
        aria-level=${item.level}
      >
        ${this.renderer?.(item) ??
        html`
          ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
          <span>${item.label}</span>
        `}
      </sl-tree-node>
    `;

    // ${item.children?.length
    //   ? html`
    //         <div role="group">
    //           ${item.children.map(child => this.renderItem(child))}
    //         </div>
    //       `
    //   : nothing}

    // return html`
    //   ${item.children?.length && item.level > 0 ? html`<div role="group">
    //     <sl-tree-node
    //     @sl-change=${(event: SlChangeEvent<boolean>) => this.#onChange(event, item)}
    //     @sl-toggle=${() => this.#onToggle(item)}
    //     ?checked=${this.dataSource?.selects === 'multiple' && item.selected}
    //     ?expandable=${item.expandable}
    //     ?expanded=${item.expanded}
    //     ?hide-guides=${this.hideGuides}
    //     ?indeterminate=${item.indeterminate}
    //     ?last-node-in-level=${item.lastNodeInLevel}
    //     ?selected=${this.dataSource?.selects === 'single' && item.selected}
    //     .level=${item.level}
    //     .node=${item}
    //     .selects=${this.dataSource?.selects}
    //     .type=${item.type}
    //     aria-level=${item.level}
    //   >
    //     ${this.renderer?.(item) ??
    //   html`
    //       ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
    //       <span>${item.label}</span>
    //     `}
    //   </sl-tree-node>
    //   </div>` : html`<sl-tree-node
    //     @sl-change=${(event: SlChangeEvent<boolean>) => this.#onChange(event, item)}
    //     @sl-toggle=${() => this.#onToggle(item)}
    //     ?checked=${this.dataSource?.selects === 'multiple' && item.selected}
    //     ?expandable=${item.expandable}
    //     ?expanded=${item.expanded}
    //     ?hide-guides=${this.hideGuides}
    //     ?indeterminate=${item.indeterminate}
    //     ?last-node-in-level=${item.lastNodeInLevel}
    //     ?selected=${this.dataSource?.selects === 'single' && item.selected}
    //     .level=${item.level}
    //     .node=${item}
    //     .selects=${this.dataSource?.selects}
    //     .type=${item.type}
    //     aria-level=${item.level}
    //   >
    //     ${this.renderer?.(item) ??
    //   html`
    //       ${icon ? html`<sl-icon size="sm" .name=${icon}></sl-icon>` : nothing}
    //       <span>${item.label}</span>
    //     `}
    //   </sl-tree-node>`}
    // `;
  } // TODO: check a11y
  // TODO: should have wrapper with role group when it's expandable?

  scrollToNode(node: TreeDataSourceNode<T>, options?: ScrollIntoViewOptions): void {
    const index = this.dataSource?.items.indexOf(node) ?? -1;
    if (index !== -1) {
      this.#virtualizer?.element(index)?.scrollIntoView(options);
    }
  }

  #onChange(event: SlChangeEvent<boolean>, node: TreeDataSourceNode<T>): void {
    console.log('event on change', event, node);
    if (event.detail) {
      this.dataSource?.select(node);
    } else {
      this.dataSource?.deselect(node);
    }

    this.selectEvent.emit(node);
  }

  #onKeydown(event: KeyboardEvent): void {
    console.log('event on keydown in tree', event, event.target, event.key, !(event.target instanceof TreeNode));
    if (!(event.target instanceof TreeNode)) {
      return;
    }

    // Expands all siblings that are at the same level as the current node.
    // See https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction

    /* if (event.key === 'Tab') {
      // this.#rovingTabindexController.clearElementCache();
      // const actionButtons = event.target.querySelectorAll('[slot="actions"] sl-button');
      const actionButtons = event.target.querySelectorAll('[slot="actions"]');
      console.log('action buttons when tab on keydown', actionButtons, event.target);
      if (actionButtons.length > 0) {
        event.preventDefault();
        (actionButtons[0] as HTMLElement).focus();
      }
    } else */ if (event.key === '*') {
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
