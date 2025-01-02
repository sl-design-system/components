import { type VirtualizerHostElement, virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, RovingTabindexController, SelectionController, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { TreeModel, type TreeModelArrayItem, type TreeModelId } from './tree-model.js';
import { TreeNode } from './tree-node.js';
import styles from './tree.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
}

/** @internal Item structure used for rendering `<sl-tree-node>`s. */
interface TreeItem<T> extends TreeModelArrayItem<T> {
  checked?: boolean;
  icon?: string;
  indeterminate?: boolean;
  selected?: boolean;
}

export interface TreeItemRendererOptions {
  expanded: boolean;
  expandable: boolean;
  selected?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TreeItemRenderer<T = any> = (item: T, options: TreeItemRendererOptions) => TemplateResult;

/**
 * A tree component. Supports both flat and nested data structures. Use this if you
 * have hierarchical data that you want to display in a tree-like structure.
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

  /** The initial expanded tree nodes. */
  @property({ type: Array }) expanded?: Array<TreeModelId<T>>;

  /** Hides the indentation guides when set. */
  @property({ type: Boolean, attribute: 'hide-guides' }) hideGuides?: boolean;

  /** @internal The array of items to be rendered. */
  @state() items?: Array<TreeItem<T>>;

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

    // Trigger first update
    void this.#onUpdate();
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
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<T>>;

  /** Contains the selection state for the tree when `selects` is defined. */
  readonly selection = new SelectionController(this);

  /** The initial selected tree node(s). */
  @property() selected?: unknown;

  /** If you are able to select one or more tree items (at the same time). */
  @property() selects?: 'single' | 'multiple';

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

    if (changes.has('expanded')) {
      this.model?.collapseAll();

      if (this.expanded) {
        this.expanded.forEach(item => this.model?.expand(item));
      }
    }

    if (changes.has('scopedElements') && this.scopedElements) {
      for (const [tagName, klass] of Object.entries(this.scopedElements)) {
        if (!this.registry?.get(tagName)) {
          this.registry?.define(tagName, klass);
        }
      }
    }

    if (changes.has('selects')) {
      this.selection.multiple = this.selects === 'multiple';

      if (this.selects === 'multiple') {
        this.setAttribute('aria-multiselectable', 'true');
      } else {
        this.removeAttribute('aria-multiselectable');
      }
    }

    if (changes.has('selected')) {
      this.selection.deselectAll();

      if (this.selects === 'single' && this.selected && !Array.isArray(this.selected)) {
        this.selection.select(this.selected);
      } else if (this.selects === 'multiple' && Array.isArray(this.selected)) {
        this.selected.forEach(item => this.selection.select(item));
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
          keyFunction: (item: TreeModelArrayItem<T>) => this.model?.getId(item.dataNode),
          renderItem: (item: TreeModelArrayItem<T>) => this.renderItem(item)
        })}
      </div>
    `;
  }

  renderItem(item: TreeItem<T>): TemplateResult {
    const { checked, dataNode, expandable, expanded, icon, indeterminate, lastNodeInLevel, level, selected } = item;

    return html`
      <sl-tree-node
        @sl-change=${(event: SlChangeEvent<boolean>) => this.#onChange(event, dataNode)}
        @sl-toggle=${() => this.#onToggle(dataNode)}
        ?checked=${checked}
        ?expandable=${expandable}
        ?expanded=${expanded}
        ?hide-guides=${this.hideGuides}
        ?indeterminate=${indeterminate}
        ?last-node-in-level=${lastNodeInLevel}
        ?selected=${selected && this.selects === 'single'}
        .data=${dataNode}
        .level=${level}
        .selects=${this.selects}
        aria-level=${level}
      >
        ${this.renderer?.(dataNode, { expanded, expandable }) ??
        html`
          ${icon ? html`<sl-icon .name=${icon}></sl-icon>` : nothing}
          <span>${this.model!.getLabel(dataNode)}</span>
        `}
      </sl-tree-node>
    `;
  }

  async #onChange(event: SlChangeEvent<boolean>, node: T): Promise<void> {
    const id = this.model!.getId(node),
      expandable = this.model!.isExpandable(node);

    if (expandable) {
      const descendants = await this.model!.getDescendants(id);

      descendants
        .filter(n => !this.model!.isExpandable(n))
        .forEach(n => {
          if (event.detail) {
            this.selection.select(this.model!.getId(n));
          } else {
            this.selection.deselect(this.model!.getId(n));
          }
        });
    } else {
      if (event.detail) {
        this.selection.select(id);
      } else {
        this.selection.deselect(id);
      }
    }

    await this.#onUpdate();
  }

  async #onKeydown(event: KeyboardEvent): Promise<void> {
    // Expands all siblings that are at the same level as the current node.
    // See https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
    if (event.key === '*' && event.target instanceof TreeNode) {
      event.preventDefault();

      const id = this.model?.getId(event.target.data as T),
        siblings = await this.model?.getSiblings(id);

      siblings?.forEach(sibling => this.model?.expand(this.model.getId(sibling), false));
      await this.#onUpdate();
    }
  }

  #onSelect(event: SlSelectEvent<T>): void {
    event.preventDefault();
    event.stopPropagation();

    this.selection.select(this.model!.getId(event.detail));
    void this.#onUpdate();
  }

  #onToggle(item: T): void {
    this.model?.toggle(this.model?.getId(item));
  }

  #onUpdate = async (): Promise<void> => {
    this.items = await this.model?.toArray();

    const isSelected = (node: T) => this.selection.isSelected(this.model!.getId(node));

    if (this.selects === 'multiple' && this.items) {
      this.items = await Promise.all(
        this.items.map(async item => {
          const { expanded, expandable, dataNode } = item,
            icon = this.model!.getIcon(dataNode, expanded),
            selected = isSelected(dataNode);

          let checked = !expandable && selected,
            indeterminate = false;
          if (expandable) {
            const descendants = (await this.model!.getDescendants(this.model!.getId(dataNode))).filter(
              n => !this.model!.isExpandable(n)
            );

            const someChecked = descendants.some(isSelected);

            if (someChecked) {
              const allChecked = descendants.every(isSelected);

              if (allChecked) {
                checked = true;
              } else if (someChecked) {
                indeterminate = true;
              }
            }
          }

          return { ...item, checked, icon, indeterminate, selected };
        })
      );
    } else {
      this.items = this.items?.map(item => {
        const icon = this.model!.getIcon(item.dataNode, item.expanded),
          selected = isSelected(item.dataNode);

        return { ...item, icon, selected };
      });
    }

    console.log(this.items);
  };
}
