import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Tag, type TagSize, type TagVariant } from './tag.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-tag-list': TagList;
  }
}
declare const TagList_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A tag list component that can contain tags.
 *
 * ```html
 * <sl-tag-list>
 *   <sl-tag>First tag</sl-tag>
 *   <sl-tag>Second tag</sl-tag>
 *   ...
 * </sl-tag-list>
 * ```
 *
 * @slot default - The place for tags.
 */
export declare class TagList extends TagList_base {
  #private;
  constructor();
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** Disables removable tags in the tag list. */
  disabled?: boolean;
  /** @internal Whether the tag list manages keyboard navigation between removable tags. */
  keyboardNavigation: boolean;
  /**
   * The size of the tag-list (determines size of tags inside the tag-list).
   *
   * @default 'md'
   */
  size?: TagSize;
  /** @internal The stack element. */
  stack?: HTMLElement;
  /** @internal The inline size of the stack element. */
  stackInlineSize: number;
  /**
   * This will hide tags that do not fit inside the available space when set. It will also display a
   * counter that indicates the number of hidden tags.
   *
   * @default false
   */
  stacked?: boolean;
  /** @internal The number of stacked tags. Applicable only when `stacked` is set. */
  stackSize: number;
  /** @internal The tag used to display the stack. */
  stackTag?: Tag;
  /** @internal The slotted tags. */
  tags: Tag[];
  /**
   * The variant of the tag-list and tags inside.
   *
   * @default 'neutral'
   */
  variant?: TagVariant;
  connectedCallback(): void;
  disconnectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
