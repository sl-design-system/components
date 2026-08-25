import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type ListDataSource } from '@sl-design-system/data-source';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-change': SlChangeEvent<number>;
  }
  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}
export type PaginatorSize = 'sm' | 'md' | 'lg';
export type PaginatorWidth = 'xs' | 'sm' | 'md' | 'lg';
export type PaginatorEmphasis = 'subtle' | 'bold';
declare const Paginator_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A paginator component used when there is a lot of data that needs to be shown and cannot be shown
 * at once, in one view/page. Can be used separately or together with paginator page size component
 * and/or paginator status component.
 */
export declare class Paginator<T = any> extends Paginator_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  get dataSource(): ListDataSource<T> | undefined;
  /**
   * By setting a dataSource, the paginator will listen for changes on the data source and control
   * the data source when the user selects a new page in the component. This can be very useful when
   * the paginator is used in combination with a data source-driven component, such as `<sl-grid>`.
   */
  set dataSource(dataSource: ListDataSource<T> | undefined);
  /**
   * The emphasis style.
   *
   * @default 'subtle'
   */
  emphasis?: PaginatorEmphasis;
  /**
   * Current page.
   *
   * @default 0
   */
  page: number;
  /** @internal Emits when the page has been changed. */
  pageChangeEvent: EventEmitter<SlChangeEvent<number>>;
  /** @internal The total number of pages. */
  pageCount: number;
  /**
   * Items per page. Default to the first item of pageSizes.
   *
   * @default 10
   */
  pageSize: number;
  get width(): PaginatorWidth | undefined;
  /**
   * The width of the paginator. This is used to determine how many pages are visible at once. For
   * `xs` a select component will be used to select the page. For all other widths, buttons will be
   * used.
   */
  set width(value: PaginatorWidth | undefined);
  /**
   * The size of the paginator which determines the size of the elements in it.
   *
   * @default 'md'
   */
  size?: PaginatorSize;
  /**
   * Total number of items.
   *
   * @default 1
   */
  totalItems: number;
  /** @internal The index of the start of the sliding window. */
  windowStart: number;
  /** @internal The index of the end of the sliding window. */
  windowEnd: number;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
