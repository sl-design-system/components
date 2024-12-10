import { localized, msg, str } from '@lit/localize';
import { sendToAnnouncer } from '@sl-design-system/announcer';
import { type DataSource } from '@sl-design-system/data-source';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './paginator-status.scss.js';

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
export class PaginatorStatus extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Pages amount. */
  #pages = 1;

  /** Currently active page, if not set - default to 1. */
  @property({ type: Number }) page = 1;

  /** @internal Currently visible items on the current page. */
  @state() currentlyVisibleItems = 1;

  /** Provided data source. */
  @property({ attribute: false }) dataSource?: DataSource;

  /** Items per page, if not set - default to 10. */
  @property({ type: Number, attribute: 'page-size' }) pageSize = 10;

  /** Total amount of items, if not set - default to 1. */
  @property({ type: Number, attribute: 'total-items' }) totalItems = 1;

  override disconnectedCallback(): void {
    this.dataSource?.removeEventListener('sl-update', this.#onUpdate);

    super.disconnectedCallback();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#pages = Math.ceil(this.totalItems / this.pageSize);

    this.#setCurrentlyVisibleItems();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('dataSource')) {
      this.dataSource?.addEventListener('sl-update', this.#onUpdate);
    }

    if (changes.has('pageSize') || changes.has('totalItems')) {
      this.#pages = Math.ceil(this.totalItems / this.pageSize);
      this.#setCurrentlyVisibleItems();
    }

    if (changes.has('page')) {
      if (this.page < 1) {
        this.page = 1;
      } else if (this.page > this.#pages) {
        this.page = this.#pages;
      }

      this.#pages = Math.ceil(this.totalItems / this.pageSize);
      this.#setCurrentlyVisibleItems();
    }
  }

  override render(): TemplateResult {
    const start = this.page === 1 ? 1 : (this.page - 1) * this.pageSize + 1;
    const end = this.page === this.#pages ? this.totalItems : this.page * this.currentlyVisibleItems;

    return html` ${msg(str`${start} - ${end} of ${this.totalItems} items`)} `;
  }

  #setCurrentlyVisibleItems(): void {
    if (!this.pageSize || !this.#pages) {
      return;
    }

    if (this.page === this.#pages) {
      const itemsOnLastPage = this.totalItems % this.pageSize;
      this.currentlyVisibleItems = itemsOnLastPage === 0 ? this.pageSize : itemsOnLastPage;
    } else {
      this.currentlyVisibleItems = this.pageSize!;
    }

    this.#announce();
  }

  #onUpdate = () => {
    if (!this.dataSource || !this.dataSource.page) {
      return;
    }

    this.pageSize = this.dataSource.page.pageSize;
    this.page = this.dataSource.page.page;
    this.totalItems = this.dataSource.page.totalItems;
  };

  #announce(): void {
    // added timeout to prevent double announcement, otherwise the first announcement would be with old or invalid values
    setTimeout(() => {
      if (this.totalItems > 1) {
        const start = this.page === 1 ? 1 : (this.page - 1) * this.pageSize + 1;
        const end = this.page === this.#pages ? this.totalItems : this.page * this.currentlyVisibleItems;

        sendToAnnouncer(msg(str`Currently showing ${start} to ${end} of ${this.totalItems} items`));
      }
    }, 100);
  }
}
