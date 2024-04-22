import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { SelectionController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { TreeModel } from './tree-model.js';
import { TreeNode } from './tree-node.js';
import styles from './tree.scss.js';
import { modelToList } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
}

export interface TreeItemRendererOptions {
  level: number;
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

  /** The tree model flattened to an array. */
  @state() nodes?: T[];

  /** The model for the tree. */
  @property({ attribute: false }) model?: TreeModel<T>;

  /** Custom renderer function for tree items. */
  @property({ attribute: false }) renderer?: TreeItemRenderer<T>;

  /** Selection manager. */
  readonly selection = new SelectionController<T>(this);

  /** If you are able to select one or more tree items (at the same time). */
  @property() selects?: 'single' | 'multiple';

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'tree';
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('model')) {
      this.nodes = modelToList(this.model);
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        ${virtualize({
          items: this.nodes,
          renderItem: (item: T) => this.renderItem(item)
        })}
      </div>
    `;
  }

  renderItem(item: T): TemplateResult {
    const model = this.model!,
      expandable = model.isExpandable(item),
      expanded = expandable && model.isExpanded(item),
      icon = model.getIcon(item),
      level = model.getLevel(item);

    return html`
      <sl-tree-node ?expanded=${expanded} ?expandable=${expandable} ?selectable=${!!this.selects} .level=${level}>
        ${this.renderer
          ? this.renderer(item, { level, expanded, expandable })
          : html`
              ${icon ? html`<sl-icon .name=${icon}></sl-icon>` : nothing}
              <span>${model.getLabel(item)}</span>
            `}
      </sl-tree-node>
    `;
  }
}
