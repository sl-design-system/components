import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { sendToAnnouncer } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { type DataSource } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem } from '@sl-design-system/menu';
import { Select, SelectOption } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PaginatorPage } from './paginator-page.js';
import styles from './paginator.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-change': SlChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}

export type VisiblePagesSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * A paginator component used when there is a lot of data that needs to be shown and cannot be shown at once, in one view/page.
 * Can be used separately or together with paginator page size component and/or paginator status component.
 */
@localized()
export class Paginator extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-menu-button': MenuButton,
      'sl-menu': Menu,
      'sl-menu-item': MenuItem,
      'sl-paginator-page': PaginatorPage,
      'sl-select': Select,
      'sl-select-option': SelectOption
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Active page. */
  #page = 1;

  /** @internal To check whether it's a first update. */
  #initialLoad = true;

  /** @internal Whether there is a mobile (compact) variant with `sl-select` instead of `pages` visible or not. */
  #mobileVariant = false;

  /** @internal Pages amount. */
  #pages = 1;

  /** Observe changes in size of the container. */
  #observer = new ResizeObserver(() => {
    requestAnimationFrame(() => this.#updateVisibility());
  });

  get page(): number {
    return this.#page;
  }

  /** Currently active page. */
  @property()
  set page(value: number) {
    this.#page = value;

    this.pageChangeEvent.emit(this.#page);
  }

  /** @internal Currently visible items on the current page. */
  @state() currentlyVisibleItems = 1;

  /** Provided data source. */
  @property({ attribute: false }) dataSource?: DataSource;

  /** @internal Hidden pages on the left, after the first page in the overflow version. */
  @state() hiddenPagesLeft: HTMLLIElement[] = [];

  /** @internal Hidden pages on the right, before the last page in the overflow version. */
  @state() hiddenPagesRight: HTMLLIElement[] = [];

  /** Items per page. Default to the first item of pageSizes, if pageSizes is not set - default to 10. */
  @property({ type: Number, attribute: 'page-size' }) pageSize?: number;

  /** @internal Emits when the page has been selected/changed. */
  @event({ name: 'sl-page-change' }) pageChangeEvent!: EventEmitter<SlChangeEvent<number>>;

  /** Page sizes - array of possible page sizes e.g. [5, 10, 15]. */
  @property({ type: Number, attribute: 'page-sizes' }) pageSizes?: number[];

  /** Total amount of items. */
  @property({ type: Number, attribute: 'total-items' }) totalItems = 1;

  /** Amount of possibly visible pages in the paginator at once. */
  @property() size?: VisiblePagesSize;

  /** @internal The value of visible pages amount, depending on the size. */
  get visiblePageAmount(): number {
    switch (this.size) {
      case 'xs':
        return 6;
      case 'sm':
        return 7;
      case 'md':
        return 9;
      default:
        return 11;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    requestAnimationFrame(() => {
      this.#observer.observe(this);
    });
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    this.dataSource?.removeEventListener('sl-update', this.#onUpdate);

    super.disconnectedCallback();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.pageSize ||= this.pageSizes?.[0] || 10;

    this.#pages = Math.ceil(this.totalItems / this.pageSize);

    if (this.page < 1) {
      this.page = 1;
    } else if (this.page > this.#pages) {
      this.page = this.#pages;
    }

    this.#setCurrentlyVisibleItems();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('pageSize')) {
      const pageSize = this.pageSize ?? 10;
      this.#pages = Math.ceil(this.totalItems / pageSize);

      this.#setCurrentlyVisibleItems();

      if (!this.#initialLoad) {
        /** Always go back to the first page when items per page has changed, but not for the first time. */
        this.page = 1;
      }

      requestAnimationFrame(() => {
        this.#updateVisibility();
      });
    }

    if (changes.has('page')) {
      if (this.page < 1) {
        this.page = 1;
      } else if (this.page > this.#pages) {
        this.page = this.#pages;
      }

      this.#setCurrentlyVisibleItems();

      if (!this.#initialLoad) {
        if (this.dataSource) {
          this.dataSource.setPage(this.page);
          this.dataSource.update();
        }
      }

      requestAnimationFrame(() => {
        this.#updateVisibility();
      });
    }

    if (changes.has('size')) {
      requestAnimationFrame(() => {
        this.#updateVisibility();
      });
    }

    if (changes.has('totalItems')) {
      const pageSize = this.pageSize ?? 10;
      this.#pages = Math.ceil(this.totalItems / pageSize) || 1;

      if (!this.#initialLoad) {
        /** Always go back to the first page when the total amount of items has changed, but not for the first time. */
        this.page = 1;
      }

      requestAnimationFrame(() => {
        this.#updateVisibility();
      });
    }

    this.dataSource?.addEventListener('sl-update', this.#onUpdate);

    this.#initialLoad = false;
  }

  override render(): TemplateResult {
    return html`
      <nav class="container">
        <sl-button
          class="prev"
          aria-label=${msg(str`Go to the previous page (${this.page - 1})`)}
          fill="ghost"
          size="lg"
          ?disabled=${this.page === 1}
          @click=${this.#onPrevious}
        >
          <sl-icon name="caret-left-solid"></sl-icon>
        </sl-button>
        <ul class="pages-wrapper">
          <li class="page">
            <sl-paginator-page
              fill="ghost"
              size="lg"
              class="page"
              ?active=${this.page == 1}
              aria-current=${ifDefined(this.page == 1 ? 'page' : undefined)}
              @click=${this.#setActive}
              >1</sl-paginator-page
            >
          </li>
          ${this.hiddenPagesLeft.length
            ? html`
                <li class="more-button">
                  <sl-menu-button fill="ghost" size="lg" aria-label=${msg('Select page number')}>
                    <sl-icon name="ellipsis-down" slot="button"></sl-icon>

                    ${this.hiddenPagesLeft.map(
                      page => html`
                        <sl-menu-item @click=${this.#setActive} aria-label=${msg(str`${page.innerText.trim()}, page`)}
                          >${page.innerText.trim()}</sl-menu-item
                        >
                      `
                    )}
                  </sl-menu-button>
                </li>
              `
            : nothing}
          ${Array.from({ length: this.#pages })
            .slice(1, this.#pages - 1)
            .map(
              (_, index) => html`
                <li class="page">
                  <sl-paginator-page
                    fill="ghost"
                    size="lg"
                    class="page"
                    ?active=${this.page == index + 2}
                    aria-current=${ifDefined(this.page == index + 2 ? 'page' : undefined)}
                    @click=${this.#setActive}
                  >
                    ${index + 2}
                  </sl-paginator-page>
                </li>
              `
            )}
          ${this.hiddenPagesRight.length
            ? html`
                <li class="more-button">
                  <sl-menu-button
                    id=${Math.random().toString(36).substring(2, 12)}
                    fill="ghost"
                    size="lg"
                    aria-label=${msg('Select page number')}
                  >
                    <sl-icon name="ellipsis-down" slot="button"></sl-icon>

                    ${this.hiddenPagesRight.map(
                      page => html`
                        <sl-menu-item @click=${this.#setActive} aria-label=${msg(str`${page.innerText.trim()}, page`)}
                          >${page.innerText.trim()}</sl-menu-item
                        >
                      `
                    )}
                  </sl-menu-button>
                </li>
              `
            : nothing}
          ${this.#pages > 1
            ? html`
                <li class="page">
                  <sl-paginator-page
                    fill="ghost"
                    size="lg"
                    class="page"
                    ?active=${this.page == this.#pages}
                    aria-current=${ifDefined(this.page == this.#pages ? 'page' : undefined)}
                    @click=${this.#setActive}
                    >${this.#pages}</sl-paginator-page
                  >
                </li>
              `
            : nothing}
        </ul>
        <div class="select-wrapper">
          <sl-select
            size="lg"
            @sl-change=${this.#setActive}
            value=${this.page}
            aria-label=${`${msg(str`${this.page}, page`)}`}
          >
            ${Array.from({ length: this.#pages })?.map(
              (_, index) => html`
                <sl-select-option
                  @click=${this.#setActive}
                  .value=${index + 1}
                  aria-label=${`${msg(str`${index + 1}, page`)}`}
                >
                  ${index + 1}
                </sl-select-option>
              `
            )}
          </sl-select>
          <span>of ${this.#pages} pages</span>
        </div>
        <sl-button
          class="next"
          aria-label=${msg(str`Go to the next page (${this.page + 1})`)}
          fill="ghost"
          size="lg"
          ?disabled=${this.page === this.#pages}
          @click=${this.#onNext}
        >
          <sl-icon name="caret-right-solid"></sl-icon>
        </sl-button>
      </nav>
    `;
  }

  /** Handles `click` event on the previous button. */
  #onPrevious() {
    this.page--;

    if (this.dataSource) {
      this.dataSource.setPage(this.page);
      this.dataSource.update();
    }

    this.#setCurrentlyVisibleItems();
    this.#updateVisibility();
  }

  /** Handles `click` event on the next button. */
  #onNext() {
    this.page++;

    if (this.dataSource) {
      this.dataSource.setPage(this.page);
      this.dataSource.update();
    }

    this.#setCurrentlyVisibleItems();
    this.#updateVisibility();
  }

  #setActive(event: Event) {
    const target = event.target as Select | PaginatorPage;

    if (target instanceof Select) {
      this.page = Number(target.value);
    } else {
      this.page = Number(target.innerText?.trim());
    }

    if (this.dataSource) {
      this.dataSource.setPage(this.page);
      this.dataSource.update();
    }

    this.#setCurrentlyVisibleItems();
    this.#updateVisibility();

    requestAnimationFrame(() => {
      const activePageElement = this.renderRoot.querySelector('[active]') as PaginatorPage;
      const activeButton = activePageElement?.renderRoot.querySelector('button');
      activeButton?.focus();
      this.#announce();
    });
  }

  #updateVisibility(): void {
    const gap = parseInt(getComputedStyle(this).getPropertyValue('--sl-space-paginator-gap') || '0'),
      pages = this.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
      pagesWrapper = this.renderRoot.querySelector('.pages-wrapper') as HTMLElement;

    let totalAmountOfPagesWidth = 0,
      [possiblyVisible, possiblyHidden]: HTMLLIElement[][] = Array.from({ length: 2 }, () => []);

    this.removeAttribute('mobile');

    pages.forEach(page => {
      page.style.display = '';
    });

    this.#mobileVariant = false;

    Array.from(pages).forEach(button => {
      totalAmountOfPagesWidth += button.getBoundingClientRect().width + gap;

      if (pagesWrapper && totalAmountOfPagesWidth > pagesWrapper.getBoundingClientRect().width - 2 * gap) {
        possiblyHidden.push(button);
      } else {
        possiblyHidden = [];
      }
    });

    possiblyVisible = Array.from(pages).filter(page => !possiblyHidden.includes(page));

    /** Max of visible amount should be 11 */
    if (possiblyVisible.length > this.visiblePageAmount) {
      possiblyVisible = Array.from(possiblyVisible).slice(0, this.visiblePageAmount);
    }

    /** Overflow variant. */
    if (
      (pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth) ||
      this.#pages > this.visiblePageAmount /*11*/
    ) {
      this.#setOverflow(possiblyVisible);
    } else {
      pages.forEach(page => (page.style.background = ''));
      this.hiddenPagesLeft = [];
      this.hiddenPagesRight = [];
    }
  }

  #setOverflow(possiblyVisible: HTMLLIElement[]) {
    const pages = this.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
      lastPage = pages.length;

    /** Mobile (compact) version with sl-select instead of sl-paginator-pages,
     * when possibly visible pages amount is smaller than 6
     * */
    this.#mobileVariant = possiblyVisible.length <= 6;
    if (this.#mobileVariant) {
      this.setAttribute('mobile', '');
      this.requestUpdate();
      return;
    }

    /**  A variant when page is bigger than half of possibly visible pages and smaller than last pages;
     *   pages before and pages after active page, from 1...active and active ... 10
     *   first page -> hidden pages on the left (one more button) -> shown pages on the left -> active page
     *   -> shown pages on the right -> hidden pages on the right (one more button) -> last page
     *   e.g.  1 ... 7 [8] 9 10 ... 20
     */
    if (
      this.page > Math.floor(possiblyVisible.length / 2) &&
      this.page <= lastPage - Math.floor(possiblyVisible.length / 2)
    ) {
      /** Possibly visible pages minus 3 - minus first, active page and last page. */
      const pagesToShow = possiblyVisible.length - 3,
        evenAmount = possiblyVisible.length % 2 === 0,
        toShowAmount = Math.floor(pagesToShow / 2);

      /** Hide pages on the left side of the active page, between first page and active page. */
      this.hiddenPagesLeft = Array.from(pages).slice(1, this.page - toShowAmount);
      this.hiddenPagesLeft.forEach(page => (page.style.display = 'none'));

      /** Hide pages on the right side of the active page, between active page and last page. */
      this.hiddenPagesRight = Array.from(pages).slice(this.page + (toShowAmount - (evenAmount ? 0 : 1)), -1);
      this.hiddenPagesRight.forEach(page => (page.style.display = 'none'));
    } else if (this.page <= Math.floor(possiblyVisible.length / 2)) {
      /**  A variant when the first page is active or the active page is smaller than the half of possibly visible pages;
       *   e.g. [1] 2 3 4 5 6...20
       *   */
      const toShowAmount = possiblyVisible.length - 2;
      /** minus last page and space for menu button */
      this.hiddenPagesLeft = [];
      this.hiddenPagesRight = Array.from(pages).slice(toShowAmount, -1);
      this.hiddenPagesRight.forEach(page => (page.style.display = 'none'));
    } else {
      /** A variant with last pages set as active page, e.g. 1... 15 16 17 18 19 [20] */
      const toShowAmount = possiblyVisible.length - 2;
      /** Minus first page and space for menu button. */
      this.hiddenPagesLeft = Array.from(pages).slice(1, pages.length - toShowAmount);
      this.hiddenPagesLeft.forEach(page => (page.style.display = 'none'));
      this.hiddenPagesRight = [];
    }
  }

  #setCurrentlyVisibleItems(): void {
    if (!this.pageSize || !this.#pages) {
      return;
    }

    if (this.page === this.#pages) {
      const itemsOnLastPage = this.totalItems % this.pageSize;
      this.currentlyVisibleItems = itemsOnLastPage === 0 ? this.pageSize : itemsOnLastPage;
    } else {
      this.currentlyVisibleItems = this.pageSize;
    }
  }

  #onUpdate = () => {
    if (!this.dataSource || !this.dataSource.page) {
      return;
    }

    this.pageSize = this.dataSource.page.pageSize;
    if (this.totalItems === this.dataSource.page.totalItems) {
      this.page = this.dataSource.page.page;
    }
    this.totalItems = this.dataSource.page.totalItems;

    requestAnimationFrame(() => this.#updateVisibility());
  };

  #announce(): void {
    if (!this.#initialLoad) {
      const start = this.page === 1 ? 1 : (this.page - 1) * (this.pageSize || 0) + 1;
      const end = this.page === this.#pages ? this.totalItems : this.page * this.currentlyVisibleItems;
      sendToAnnouncer(msg(str`Currently showing ${start} to ${end} of ${this.totalItems} items`));
    }
  }
}
