import { type VirtualizerHostElement, virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, RovingTabindexController, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { TreeModel, type TreeModelNode, TreeModelNodePlaceholder } from './tree-model.js';
import { TreeNode } from './tree-node.js';
import styles from './tree.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TreeItemRenderer<T = any> = (item: TreeModelNode<T>) => TemplateResult;

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
      'sl-tree-node': TreeNode
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The data model for the tree. */
  #model?: TreeModel<T>;

  /** Manage keyboard navigation between tabs. */
  #rovingTabindexController = new RovingTabindexController<TreeNode>(this, {
    focusInIndex: (elements: TreeNode[]) => elements.findIndex(el => !el.disabled),
    elements: () => Array.from(this.shadowRoot?.querySelectorAll('sl-tree-node') ?? []),
    isFocusableElement: (el: TreeNode) => !el.disabled
  });

  /** The virtualizer instance. */
  #virtualizer?: VirtualizerHostElement[typeof virtualizerRef];

  /** Hides the indentation guides when set. */
  @property({ type: Boolean, attribute: 'hide-guides' }) hideGuides?: boolean;

  /** @internal The array of items to be rendered. */
  @state() items?: Array<TreeModelNode<T> | typeof TreeModelNodePlaceholder>;

  get model() {
    return this.#model;
  }

  /** The model for the tree. */
  @property({ attribute: false })
  set model(model: TreeModel<T> | undefined) {
    if (this.#model) {
      this.#model.removeEventListener('sl-update', this.#onUpdate);
    }

    this.#model = model;
    this.#model?.addEventListener('sl-update', this.#onUpdate);

    // Trigger first time render
    this.#onUpdate();
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
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<TreeModelNode<T>>>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'tree';
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    const host = this.renderRoot.querySelector('[part="wrapper"]') as VirtualizerHostElement;
    this.#virtualizer = host[virtualizerRef];
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('model')) {
      if (this.model?.selects === 'multiple') {
        this.setAttribute('aria-multiselectable', 'true');
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

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('items')) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.#virtualizer?.layoutComplete.then(() => {
        this.#rovingTabindexController.clearElementCache();
      });
    }
  }

  override render(): TemplateResult {
    return html`
      <div @keydown=${this.#onKeydown} @sl-select=${this.#onSelect} part="wrapper">
        ${virtualize({
          items: this.items,
          keyFunction: (item: TreeModelNode<T> | typeof TreeModelNodePlaceholder) =>
            item === TreeModelNodePlaceholder ? TreeModelNodePlaceholder : item.id,
          renderItem: (item: TreeModelNode<T> | typeof TreeModelNodePlaceholder) => this.renderItem(item)
        })}
      </div>
    `;
  }

  renderItem(item: TreeModelNode<T> | typeof TreeModelNodePlaceholder): TemplateResult {
    if (item === TreeModelNodePlaceholder) {
      return html`<div part="placeholder"></div>`;
    }

    const icon = item.expanded ? item.expandedIcon : item.icon;

    return html`
      <sl-tree-node
        @sl-change=${(event: SlChangeEvent<boolean>) => this.#onChange(event, item)}
        @sl-toggle=${() => this.#onToggle(item)}
        ?checked=${this.model?.selects === 'multiple' && item.selected}
        ?expandable=${item.expandable}
        ?expanded=${item.expanded}
        ?hide-guides=${this.hideGuides}
        ?indeterminate=${item.indeterminate}
        ?last-node-in-level=${item.lastNodeInLevel}
        ?selected=${this.model?.selects === 'single' && item.selected}
        .level=${item.level}
        .node=${item}
        .selects=${this.model?.selects}
        aria-level=${item.level}
      >
        ${this.renderer?.(item) ??
        html`
          ${icon ? html`<sl-icon .name=${icon}></sl-icon>` : nothing}
          <span>${item.label}</span>
        `}
      </sl-tree-node>
    `;
  }

  #onChange(event: SlChangeEvent<boolean>, node: TreeModelNode<T>): void {
    this.model?.select(node, event.detail);
    this.selectEvent.emit(node);
  }

  #onKeydown(event: KeyboardEvent): void {
    // Expands all siblings that are at the same level as the current node.
    // See https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
    if (event.key === '*' && event.target instanceof TreeNode) {
      event.preventDefault();

      const treeNode = event.target.node as TreeModelNode<T>,
        siblings = treeNode.parent?.children ?? this.model?.treeNodes;

      if (Array.isArray(siblings)) {
        siblings
          .filter(sibling => sibling !== treeNode && sibling.expandable)
          .forEach(sibling => this.model?.expand(sibling, false));
      }

      this.#onUpdate();
    }
  }

  #onSelect(event: SlSelectEvent<TreeModelNode<T>>): void {
    event.preventDefault();
    event.stopPropagation();

    this.model?.select(event.detail);
    this.selectEvent.emit(event.detail);
  }

  #onToggle(node: TreeModelNode<T>): void {
    this.model?.toggle(node);
  }

  #onUpdate = (): void => {
    this.items = this.model?.toArray() ?? [];
  };
}
