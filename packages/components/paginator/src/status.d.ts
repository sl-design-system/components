import { type ListDataSource } from '@sl-design-system/data-source';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-paginator-status': PaginatorStatus;
  }
}
/**
 * A component that can be used with the paginator component. Contains information about currently
 * visible items on the page and total amount of items.
 */
export declare class PaginatorStatus<T = any> extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  get dataSource(): ListDataSource<T> | undefined;
  /**
   * By setting a dataSource, the component will listen for changes on the data source and control
   * the data source when the user selects a new page size in the component.
   */
  set dataSource(dataSource: ListDataSource<T> | undefined);
  /**
   * The label to display for the 'items'. If not set, defaults to "Items". You can use this to set
   * a custom label, such as "students" or "books" or something else. Please remember to provide a
   * translation for the label in your application.
   */
  itemLabel?: string;
  /**
   * Current page.
   *
   * @default 0
   */
  page: number;
  /** @internal The total number of pages. */
  pageCount: number;
  /**
   * Items per page.
   *
   * @default 10
   */
  pageSize: number;
  /** @internal The current range of items visible. */
  range?: number[];
  /**
   * Total number of items.
   *
   * @default 1
   */
  totalItems: number;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
