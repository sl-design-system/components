import { localized, msg, str } from '@lit/localize';
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
  @property({ type: Number, attribute: 'active-page' }) activePage = 1;

  /** @internal Currently visible items on the current page. */
  @state() currentlyVisibleItems = 1;

  /** Items per page, if not set - default to 10. */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage = 10;

  /** Total amount of items, if not set - default to 1. */
  @property({ type: Number }) total = 1;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#pages = Math.ceil(this.total / this.itemsPerPage);

    if (this.activePage < 1) {
      this.activePage = 1;
    } else if (this.activePage > this.#pages) {
      this.activePage = this.#pages;
    }

    requestAnimationFrame(() => {
      this.#setCurrentlyVisibleItems();
    });
    // this.#setCurrentlyVisibleItems();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('changes', changes);

    if (changes.has('itemsPerPage') || changes.has('total')) {
      this.#pages = Math.ceil(this.total / this.itemsPerPage);
      this.#setCurrentlyVisibleItems();
    }

    if (changes.has('activePage')) {
      if (this.activePage < 1) {
        this.activePage = 1;
      } else if (this.activePage > this.#pages) {
        this.activePage = this.#pages;
      }

      this.#pages = Math.ceil(this.total / this.itemsPerPage);
      requestAnimationFrame(() => {
        this.#setCurrentlyVisibleItems();
      });
      // this.#setCurrentlyVisibleItems();
    }
  }

  override render(): TemplateResult {
    const start = this.activePage === 1 ? 1 : (this.activePage - 1) * this.itemsPerPage + 1;
    const end = this.activePage === this.#pages ? this.total : this.activePage * this.currentlyVisibleItems;
    // console.log('start - end', start, end);

    return html`
      ${msg(str`${start} - ${end} of ${this.total} items`)}
      <!-- We want this to be read every time the active page changes. -->
      <span id="live" aria-live="polite" aria-atomic="true">
        ${msg(str`Currently shown from ${start} to ${end} of ${this.total} items`)}
      </span>
    `;
  }

  #setCurrentlyVisibleItems(): void {
    if (!this.itemsPerPage || !this.#pages) {
      return;
    }

    if (this.activePage === this.#pages) {
      const itemsOnLastPage = this.total % this.itemsPerPage;
      this.currentlyVisibleItems = itemsOnLastPage === 0 ? this.itemsPerPage : itemsOnLastPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage!;
    }
  }
}
