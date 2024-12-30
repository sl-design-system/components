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
    direction: 'vertical',
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
      <div @sl-select=${this.#onSelect} part="wrapper">
        ${virtualize({
          items,
          keyFunction: (item: TreeModelArrayItem<T>) => this.model?.getId(item.dataNode),
          renderItem: (item: TreeModelArrayItem<T>) => this.renderItem(item)
        })}
      </div>
    `;
  }

  renderItem(item: TreeModelArrayItem<T>): TemplateResult {
    const { dataNode, expandable, expanded, lastNodeInLevel, level } = item,
      icon = this.model!.getIcon(dataNode, expanded),
      selected = this.selection.isSelected(this.model!.getId(dataNode));

    console.log('renderItem', dataNode, selected);

    return html`
      <sl-tree-node
        @sl-change=${(event: SlChangeEvent<boolean>) => this.#onChange(event, dataNode)}
        @sl-toggle=${() => this.#onToggle(dataNode)}
        ?checked=${selected && this.selects === 'multiple'}
        ?expandable=${expandable}
        ?expanded=${expanded}
        ?hide-guides=${this.hideGuides}
        ?last-node-in-level=${lastNodeInLevel}
        ?selected=${selected && this.selects === 'single'}
        .data=${dataNode}
        .level=${level}
        .selects=${this.selects}
      >
        ${this.renderer
          ? this.renderer(dataNode, { expanded, expandable })
          : html`
              ${icon ? html`<sl-icon .name=${icon}></sl-icon>` : nothing}
              <span>${this.model!.getLabel(dataNode)}</span>
            `}
      </sl-tree-node>
    `;
  }

  #onChange(event: SlChangeEvent<boolean>, item: T): void {
    console.log('event', event, event.detail, item);
  }

  #onSelect(event: SlSelectEvent<T>): void {
    event.preventDefault();
    event.stopPropagation();

    console.log('select', this.model!.getId(event.detail));

    this.selection.select(this.model!.getId(event.detail));
  }

  #onToggle(item: T): void {
    this.model?.toggle(this.model?.getId(item));
  }

  #onUpdate = (): void => {
    this.requestUpdate('model');
  };
}
