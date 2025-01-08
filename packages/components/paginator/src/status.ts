import { localized, msg, str } from '@lit/localize';
import { announce } from '@sl-design-system/announcer';
import { DATA_SOURCE_DEFAULT_PAGE_SIZE, type ListDataSource } from '@sl-design-system/data-source';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './status.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-paginator-status': PaginatorStatus;
  }
}

/**
 * A component that can be used with the paginator component.
 * Contains information about currently visible items on the page and total amount of items.
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PaginatorStatus<T = any> extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The data source that the paginator controls. */
  #dataSource?: ListDataSource<T>;

  /** Timeout id, to be used with `clearTimeout`. */
  #timeoutId?: ReturnType<typeof setTimeout>;

  get dataSource(): ListDataSource<T> | undefined {
    return this.#dataSource;
  }

  /**
   * By setting a dataSource, the component will listen for changes on the data source
   * and control the data source when the user selects a new page size in the component.
   */
  @property({ attribute: false })
  set dataSource(dataSource: ListDataSource<T> | undefined) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.#onUpdate);
    }

    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);

    this.#onUpdate();
  }

  /**
   * Current page.
   * @default 0
   */
  @property({ type: Number }) page = 0;

  /** @internal The total number of pages. */
  @property({ type: Number, attribute: 'page-count' }) pageCount = 1;

  /**
   * Items per page.
   * @default 10
   */
  @property({ type: Number, attribute: 'page-size' }) pageSize = DATA_SOURCE_DEFAULT_PAGE_SIZE;

  /** @internal The current range of items visible. */
  @state() range?: number[];

  /**
   * Total number of items.
   * @default 1
   */
  @property({ type: Number, attribute: 'total-items' }) totalItems = 1;

  override connectedCallback(): void {
    super.connectedCallback();

    this.dataSource?.addEventListener('sl-update', this.#onUpdate);
  }

  override disconnectedCallback(): void {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = undefined;
    }

    this.dataSource?.removeEventListener('sl-update', this.#onUpdate);

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('page') || changes.has('pageSize') || changes.has('totalItems')) {
      this.pageSize ??= 10;
      this.pageCount = Math.ceil(this.totalItems / this.pageSize) || 1;
      this.page = Math.min(Math.max(this.page, 0), this.pageCount - 1);

      const start = this.page * this.pageSize + 1;

      let end = start + this.pageSize - 1;
      if (this.page === this.pageCount - 1) {
        end += this.totalItems % this.pageSize;
        end = Math.min(end, this.totalItems);
      }

      this.range = [start, end];

      this.#announce();
    }
  }

  override render(): TemplateResult {
    const [start, end] = this.range ?? [1, 1];

    return html`${msg(str`${start} - ${end} of ${this.totalItems} items`)}`;
  }

  #onUpdate = () => {
    this.page = this.dataSource!.page ?? 0;
    this.pageSize = this.dataSource!.pageSize;
    this.totalItems = this.dataSource!.size;
  };

  #announce(): void {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = undefined;
    }

    // Added timeout to prevent double announcement, otherwise the first
    // announcement would be with old or invalid values
    this.#timeoutId = setTimeout(() => {
      if (this.totalItems > 1) {
        const [start, end] = this.range ?? [1, 1];

        announce(msg(str`Currently showing ${start} to ${end} of ${this.totalItems} items`));
      }
    }, 100);
  }
}
