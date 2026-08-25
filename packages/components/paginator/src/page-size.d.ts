import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type ListDataSource } from '@sl-design-system/data-source';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-size-change': SlChangeEvent<number>;
  }
  interface HTMLElementTagNameMap {
    'sl-paginator-page-size': PaginatorPageSize;
  }
}
declare const PaginatorPageSize_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * A component that can be used with the paginator. The component adds a possibility to
 * select/change the amount of items that would be visible per page.
 */
export declare class PaginatorPageSize<T = any> extends PaginatorPageSize_base {
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
   * The label to display for the 'items' per page selector. If not set, defaults to "Items". You
   * can use this to set a custom label, such as "Students" or "Books" or something else. Please
   * remember to provide a translation for the label in your application.
   */
  itemLabel?: string;
  get pageSize(): number;
  /** Items per page. */
  set pageSize(pageSize: number);
  /** @internal Emits when the page size has been selected/changed. */
  pageSizeChangeEvent: EventEmitter<SlChangeEvent<number>>;
  /** Available page sizes. */
  pageSizes?: number[];
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): TemplateResult;
}
export {};
