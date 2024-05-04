import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { RovingTabindexController, SelectionController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { TreeModel, type TreeModelArrayItem } from './tree-model.js';
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

  /** Manage keyboard navigation between tabs. */
  #rovingTabindexController = new RovingTabindexController<TreeNode>(this, {
    focusInIndex: (elements: TreeNode[]) => elements.findIndex(el => !el.disabled),
    direction: 'vertical',
    elements: () => Array.from(this.renderRoot.querySelectorAll('sl-tree-node')) || [],
    isFocusableElement: (el: TreeNode) => !el.disabled
  });

  /** Contains the expanded state for the tree. */
  readonly expansion = new SelectionController<T>(this, { multiple: true });

  /** The model for the tree. */
  @property({ attribute: false }) model?: TreeModel<T>;

  /** Custom renderer function for tree items. */
  @property({ attribute: false }) renderer?: TreeItemRenderer<T>;

  /** Contains the selection state for the tree when `selects` is defined. */
  readonly selection = new SelectionController<T>(this);

  /** If you are able to select one or more tree items (at the same time). */
  @property() selects?: 'single' | 'multiple';

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'tree';
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('selects')) {
      this.selection.multiple = this.selects === 'multiple';
    }
  }

  override render(): TemplateResult {
    const items = this.model?.toArray(this.expansion) ?? [];

    setTimeout(() => this.#rovingTabindexController.clearElementCache(), 100);

    return html`
      <div part="wrapper">
        ${virtualize({
          items,
          keyFunction: this.model?.trackBy
            ? (item: TreeModelArrayItem<T>, index: number) => this.model!.trackBy!(item.dataNode, index)
            : undefined,
          renderItem: (item: TreeModelArrayItem<T>) => this.renderItem(item)
        })}
      </div>
    `;
  }

  renderItem(item: TreeModelArrayItem<T>): TemplateResult {
    const { dataNode, expandable, expanded, lastNodeInLevel, level } = item,
      icon = this.model!.getIcon(dataNode, expanded);

    return html`
      <sl-tree-node
        @sl-toggle=${() => this.#onToggle(dataNode)}
        ?expandable=${expandable}
        ?expanded=${expanded}
        ?selected=${this.selection.isSelected(dataNode)}
        .lastNodeInLevel=${lastNodeInLevel}
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

  #onToggle(item: T): void {
    this.expansion.toggle(item);
  }
}
