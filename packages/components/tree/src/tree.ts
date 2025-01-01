import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, RovingTabindexController, SelectionController, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { TreeModel, type TreeModelArrayItem, type TreeModelId } from './tree-model.js';
import { TreeNode } from './tree-node.js';
import styles from './tree.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
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
    elements: () => Array.from(this.renderRoot.querySelectorAll('sl-tree-node')) || [],
    isFocusableElement: (el: TreeNode) => !el.disabled
  });

  /** The initial expanded tree nodes. */
  @property({ type: Array }) expanded?: Array<TreeModelId<T>>;

  /** Hides the indentation guides when set. */
  @property({ type: Boolean, attribute: 'hide-guides' }) hideGuides?: boolean;

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

  override render(): TemplateResult {
    const items = this.model?.toArray() ?? [];

    setTimeout(() => this.#rovingTabindexController.clearElementCache(), 100);

    return html`
      <div @keydown=${this.#onKeydown} @sl-select=${this.#onSelect} part="wrapper">
        ${virtualize({
          items,
          keyFunction: (item: TreeModelArrayItem<T>) => this.model?.getId(item.dataNode),
          renderItem: (item: TreeModelArrayItem<T>) => this.renderItem(item)
        })}
      </div>
    `;
  }

  renderItem(item: TreeModelArrayItem<T>): TemplateResult {
    const isSelected = (node: T) => this.selection.isSelected(this.model!.getId(node)),
      { dataNode, expandable, expanded, lastNodeInLevel, level } = item,
      icon = this.model!.getIcon(dataNode, expanded),
      selected = isSelected(dataNode);

    let checked = false,
      indeterminate = false;
    if (this.selects === 'multiple') {
      checked = !expandable && selected;

      if (expandable) {
        const descendants = this.model!.getDescendants(this.model!.getId(dataNode)).filter(
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
    }

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
      >
        ${this.renderer?.(dataNode, { expanded, expandable }) ??
        html`
          ${icon ? html`<sl-icon .name=${icon}></sl-icon>` : nothing}
          <span>${this.model!.getLabel(dataNode)}</span>
        `}
      </sl-tree-node>
    `;
  }

  #onChange(event: SlChangeEvent<boolean>, node: T): void {
    const id = this.model!.getId(node),
      expandable = this.model!.isExpandable(node);

    if (expandable) {
      const descendants = this.model!.getDescendants(id).filter(n => !this.model!.isExpandable(n));

      descendants.forEach(n => {
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
  }

  #onKeydown(event: KeyboardEvent): void {
    // Expands all siblings that are at the same level as the current node.
    // See https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
    if (event.key === '*' && event.target instanceof TreeNode) {
      event.preventDefault();

      const id = this.model?.getId(event.target.data as T);

      this.model?.getSiblings(id).forEach(sibling => {
        this.model?.expand(this.model.getId(sibling));
      });
    }
  }

  #onSelect(event: SlSelectEvent<T>): void {
    event.preventDefault();
    event.stopPropagation();

    this.selection.select(this.model!.getId(event.detail));
  }

  #onToggle(item: T): void {
    this.model?.toggle(this.model?.getId(item));
  }

  #onUpdate = (): void => {
    this.requestUpdate('model');
  };
}
