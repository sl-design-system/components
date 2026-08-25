import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { TreeDataSource, type TreeDataSourceNode } from './tree-data-source.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-tree': Tree;
  }
}
export type TreeItemRenderer<T = any> = (item: TreeDataSourceNode<T>) => TemplateResult | undefined;
declare const Tree_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ObserveAttributesMixinInterface
  >;
/** A tree component. Use this if you have hierarchical data that you want to visualize. */
export declare class Tree<T = any> extends Tree_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  get dataSource(): TreeDataSource<T> | undefined;
  /**
   * The model for the tree.
   *
   * @type {TreeDataSource<T> | undefined}
   */
  set dataSource(dataSource: TreeDataSource<T> | undefined);
  /** Hides the indentation guides when set. */
  hideGuides?: boolean;
  /** Custom renderer function for tree items. */
  renderer?: TreeItemRenderer<T>;
  /**
   * The custom elements used for rendering this tree. If you are using a custom renderer to render
   * the tree nodes, any custom elements you use in the renderer need to be specified via this
   * property. Otherwise those custom elements will not initialize, since the tree uses a Scoped
   * Custom Element Registry.
   */
  scopedElements?: Record<string, typeof HTMLElement>;
  /** @internal Emits when the user selects a tree node. */
  selectEvent: EventEmitter<SlSelectEvent<TreeDataSourceNode<T>>>;
  /** @internal */
  wrapper: HTMLElement;
  connectedCallback(): void;
  firstUpdated(changes: PropertyValues<this>): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
