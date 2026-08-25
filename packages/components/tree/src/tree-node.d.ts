import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type Menu } from '@sl-design-system/menu';
import { type EventEmitter } from '@sl-design-system/shared';
import {
  type SlChangeEvent,
  type SlSelectEvent,
  type SlToggleEvent
} from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type TreeDataSourceNode } from './tree-data-source.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-tree-node': TreeNode;
  }
}
export type TreeNodeContextMenu<T> = (node: TreeDataSourceNode<T>) => Menu | undefined;
export type TreeNodeType = 'node' | 'placeholder' | 'skeleton';
declare const TreeNode_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A tree node component. Used to represent a node in a tree. This component is not public API and
 * is used internally by `<sl-tree>`.
 */
export declare class TreeNode<T = any> extends TreeNode_base {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal Emits when the checked state of the checkbox changes. */
  changeEvent: EventEmitter<SlChangeEvent<boolean>>;
  /**
   * Whether the node is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, will render an indicator whether the node is expanded or collapsed.
   *
   * @default false
   */
  expandable?: boolean;
  /**
   * Indicates whether the node is expanded or collapsed.
   *
   * @default false
   */
  expanded?: boolean;
  /**
   * Indeterminate state of the checkbox. Used when not all children are checked.
   *
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Whether this node is the last one on this level; used for styling.
   *
   * @default false
   */
  lastNodeInLevel?: boolean;
  /**
   * The depth level of this node, 0 being the root of the tree.
   *
   * @default 0
   */
  level: number;
  /** An array indicating which levels have a next sibling; used to render indentation guides. */
  levelGuides?: number[];
  /**
   * Will render a checkbox to allow for multiple selections.
   *
   * @default false
   */
  multiple?: boolean;
  /** The tree model node. */
  node?: TreeDataSourceNode<T>;
  /**
   * Whether the node can be selected. When false, the node does not render a checkbox and cannot be
   * selected by the user.
   *
   * @default false
   */
  selectable?: boolean;
  /**
   * Determines whether the node is selected or not.
   *
   * @default false
   */
  selected?: boolean;
  /** @internal Emits when the user clicks on the wrapper part of the tree node. */
  selectEvent: EventEmitter<SlSelectEvent<TreeDataSourceNode<T>>>;
  /** @internal Emits when the expanded state changes. */
  toggleEvent: EventEmitter<SlToggleEvent<boolean>>;
  /**
   * The type of tree node: - 'node': A regular tree node. - 'placeholder': A placeholder node used
   * for loading children. - 'skeleton': A skeleton node used for loading individual nodes.
   *
   * @default 'node'
   */
  type?: TreeNodeType;
  connectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  toggle(expanded?: boolean): void;
}
export {};
