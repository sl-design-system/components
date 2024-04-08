import { LitVirtualizer } from '@lit-labs/virtualizer';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type DataSource } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { type TreeControl } from './tree-control.js';
import { TreeItem } from './tree-item.js';
import styles from './tree.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
}

export interface TreeItemRendererOptions {
  level: number;
  expanded: boolean;
  expandable: boolean;
  selected: boolean;
}

export type TreeItemRenderer<T> = (item: T, options: TreeItemRendererOptions) => TemplateResult;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Tree<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'lit-virtualizer': LitVirtualizer,
      'sl-icon': Icon,
      'sl-tree-item': TreeItem
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The source for all the tree items. */
  @property({ attribute: false }) dataSource?: DataSource;

  /** Custom renderer function for tree items. */
  @property({ attribute: false }) renderer?: TreeItemRenderer<T>;

  /** If you are able to select one or more tree items (at the same time). */
  @property() selects?: 'single' | 'multiple';

  /** Control for managing the tree. */
  @property({ attribute: false }) treeControl?: TreeControl<T>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'tree';
  }

  override render(): TemplateResult {
    return html`<lit-virtualizer .items=${[]}></lit-virtualizer>`;
  }
}
