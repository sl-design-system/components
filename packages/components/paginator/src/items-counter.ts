import { localized } from '@lit/localize';
import {type CSSResultGroup, LitElement, type TemplateResult, html, type PropertyValues} from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './items-counter.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-items-counter': ItemsCounter;
  }
}

/**
 * A component that can be used with paginator. Contains information about currently visible items on the page
 * and total amount of items.
 */
@localized()
export class ItemsCounter extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  // TODO: accessibility

  // TODO: unit tests

  // TODO:  data - how to connect with data? make an example / story

  /** Total amount of items. */
  @property() total?: number;

  /** Items per page, if not set - default to 10. */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage?: number;

  /** @internal pages amount */ // TODO: state maybe?
  #pages: number = 1;

  /** @internal active */ // TODO: state maybe?
  @state() activePage: number = 1; // TODO: should be possible to set manually!!!

  /** @internal currently visible items on the current page */ // TODO: state maybe?
  @state() currentlyVisibleItems: number = 1;

 // #mobileVariant: boolean = false;

  override connectedCallback(): void {
    super.connectedCallback();

    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    this.#pages = Math.ceil(total / itemsPerPage) || 1;

    if (this.activePage < 1) {
      this.activePage = 1;
    } else if (this.activePage > this.#pages) {
      this.activePage = this.#pages;
    }

    console.log('pages in connectedCallback', this.#pages, this.activePage, itemsPerPage, total % itemsPerPage);

    if (this.activePage === this.#pages) {
      console.log('last page is active');
      this.currentlyVisibleItems = total % itemsPerPage;
    } else {
      this.currentlyVisibleItems = itemsPerPage;
    }
  }

  // TODO: updated when total or itemsperpage has changed

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('changes in updated in ItemsCounter', changes);

    if (changes.has('itemsPerPage')) {
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(total / itemsPerPage) || 2;
      if (this.activePage === this.#pages) { // TODO: this part probably needs to be moved to currentlyVisibleItems...
        const total = this.total ?? 0;
        const itemsPerPage = this.itemsPerPage ?? 10;
        console.log('last page is active');
        this.currentlyVisibleItems = total % itemsPerPage;
      } else {
        this.currentlyVisibleItems = this.itemsPerPage!;
      }
    }

    if (changes.has('activePage')) {
      if (this.activePage < 1) {
        this.activePage = 1;
      } else if (this.activePage > this.#pages) {
        this.activePage = this.#pages;
      }
    }
  }

  override render(): TemplateResult {
    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    const start = this.activePage === 1 ? 1 : ((this.activePage - 1) * itemsPerPage) + 1;
    const end = this.activePage === this.#pages ? total : this.activePage * this.currentlyVisibleItems;

    return html`
      ${start} - ${end} of ${this.total} items
    `;
  } // TODO: add msg localize str
}

// TODO: what to do when we have less pages than in the select selected? so always show all when there are less when the smaller value in select?

