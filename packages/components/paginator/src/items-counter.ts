import { localized, msg, str } from '@lit/localize';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './items-counter.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-items-counter': ItemsCounter;
  }
}

/**
 * A component that can be used with the paginator component.
 * Contains information about currently visible items on the page and total amount of items.
 */
@localized()
export class ItemsCounter extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  // TODO: accessibility

  // TODO: unit tests

  /** Currently active page. */
  @property({ type: Number, attribute: 'active-page' }) activePage: number = 1;

  /** Items per page, if not set - default to 10. */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage?: number;

  /** @internal currently visible items on the current page */
  @state() currentlyVisibleItems: number = 1;

  /** @internal pages amount */
  #pages: number = 1;

  /** Total amount of items. */
  @property() total?: number;

  override connectedCallback(): void {
    super.connectedCallback();

    const total = this.total ?? 0;
    this.itemsPerPage = this.itemsPerPage ?? 10;
    this.#pages = Math.ceil(total / this.itemsPerPage) || 1;

    if (this.activePage < 1) {
      this.activePage = 1;
    } else if (this.activePage > this.#pages) {
      this.activePage = this.#pages;
    }

    this.#setCurrentlyVisibleItems();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('itemsPerPage') || changes.has('total')) {
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(total / itemsPerPage) || 2;
      this.itemsPerPage = this.itemsPerPage ?? 10;
      this.#setCurrentlyVisibleItems();
    }

    if (changes.has('activePage')) {
      if (this.activePage < 1) {
        this.activePage = 1;
      } else if (this.activePage > this.#pages) {
        this.activePage = this.#pages;
      }

      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(total / itemsPerPage) || 2;
      this.itemsPerPage = this.itemsPerPage ?? 10;
      this.#setCurrentlyVisibleItems();
    }
  }

  override render(): TemplateResult {
    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    const start = this.activePage === 1 ? 1 : (this.activePage - 1) * itemsPerPage + 1;
    const end = this.activePage === this.#pages ? total : this.activePage * this.currentlyVisibleItems;

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
      const total = this.total ?? 0;
      const itemsOnLastPage = total % this.itemsPerPage;
      this.currentlyVisibleItems = itemsOnLastPage === 0 ? this.itemsPerPage : itemsOnLastPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage!;
    }
  }
}
