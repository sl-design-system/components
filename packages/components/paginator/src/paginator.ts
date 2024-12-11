import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Paginator<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-menu': Menu,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
      'sl-paginator-page': PaginatorPage,
      'sl-select': Select,
      'sl-select-option': SelectOption
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The data source that the paginator controls. */
  #dataSource?: DataSource<T>;

  /** Whether there is a mobile (compact) variant with `sl-select` instead of `pages` visible or not. */
  #mobileVariant = false;

  /** Observe changes in size of the container. */
  #observer = new ResizeObserver(() => this.#updateVisibility());

  /** Active page. */
  #page = 1;

  get dataSource(): DataSource<T> | undefined {
    return this.#dataSource;
  }

  /**
   * By setting a dataSource, the paginator will listen for changes on the data source
   * and control the data source when the user selects a new page in the component. This
   * can be very useful when the paginator is used in combination with a data source fed
   * component, such as `<sl-grid>`.
   */
  @property({ attribute: false })
  set dataSource(dataSource: DataSource<T> | undefined) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.#onUpdate);
    }

    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);

    this.#onUpdate();
  }

  /** @internal Hidden pages on the left, after the first page in the overflow version. */
  @state() hiddenPagesLeft: HTMLLIElement[] = [];

  /** @internal Hidden pages on the right, before the last page in the overflow version. */
  @state() hiddenPagesRight: HTMLLIElement[] = [];

  get page(): number {
    return this.#page;
  }

  /** Currently active page. */
  @property({ type: Number })
  set page(value: number) {
    this.#page = value;

    this.pageChangeEvent.emit(this.#page);
  }

  /** @internal Emits when the page has been changed. */
  @event({ name: 'sl-page-change' }) pageChangeEvent!: EventEmitter<SlChangeEvent<number>>;

  /** @internal The total number of pages. */
  @property({ type: Number, attribute: 'page-count' }) pageCount = 1;

  /** Items per page. Default to the first item of pageSizes, if pageSizes is not set - defaults to 10. */
  @property({ type: Number, attribute: 'page-size' }) pageSize?: number;

  /** Page sizes - array of possible page sizes e.g. [5, 10, 15]. */
  @property({ type: Array, attribute: 'page-sizes' }) pageSizes?: number[];

  /** Amount of possibly visible pages in the paginator at once. */
  @property() size?: VisiblePagesSize;

  /** Total amount of items. */
  @property({ type: Number, attribute: 'total-items' }) totalItems = 1;

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

    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);
    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.#dataSource?.removeEventListener('sl-update', this.#onUpdate);

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('page') || changes.has('pageSize') || changes.has('pageSizes') || changes.has('totalItems')) {
      this.pageSize ??= this.pageSizes?.at(0) ?? 10;
      this.pageCount = Math.ceil(this.totalItems / this.pageSize) || 1;
      this.page = Math.min(Math.max(this.page, 1), this.pageCount);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('page') || changes.has('pageCount') || changes.has('pageSize') || changes.has('size')) {
      this.#updateVisibility();
    }
  }

  override render(): TemplateResult {
    return html`
      <nav class="container">
        <sl-button
          @click=${this.#onPrevious}
          ?disabled=${this.page === 1}
          aria-label=${msg(str`Go to the previous page (${this.page - 1})`)}
          class="prev"
          fill="ghost"
          size="lg"
        >
          <sl-icon name="caret-left-solid"></sl-icon>
        </sl-button>

        <ul class="pages-wrapper">
          <li class="page">
            <sl-paginator-page
              @click=${this.#onClick}
              ?active=${this.page === 1}
              aria-current=${ifDefined(this.page === 1 ? 'page' : undefined)}
              class="page"
              fill="ghost"
              size="lg"
            >
              1
            </sl-paginator-page>
          </li>
          ${this.hiddenPagesLeft.length
            ? html`
                <li class="more-button">
                  <sl-menu-button fill="ghost" size="lg" aria-label=${msg('Select page number')}>
                    <sl-icon name="ellipsis-down" slot="button"></sl-icon>

                    ${this.hiddenPagesLeft.map(
                      page => html`
                        <sl-menu-item @click=${this.#onClick} aria-label=${msg(str`${page.innerText.trim()}, page`)}>
                          ${page.innerText.trim()}
                        </sl-menu-item>
                      `
                    )}
                  </sl-menu-button>
                </li>
              `
            : nothing}
          ${Array.from({ length: this.pageCount })
            .slice(1, this.pageCount - 1)
            .map(
              (_, index) => html`
                <li class="page">
                  <sl-paginator-page
                    @click=${this.#onClick}
                    ?active=${this.page === index + 2}
                    aria-current=${ifDefined(this.page === index + 2 ? 'page' : undefined)}
                    class="page"
                    fill="ghost"
                    size="lg"
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
                        <sl-menu-item @click=${this.#onClick} aria-label=${msg(str`${page.innerText.trim()}, page`)}>
                          ${page.innerText.trim()}
                        </sl-menu-item>
                      `
                    )}
                  </sl-menu-button>
                </li>
              `
            : nothing}
          ${this.pageCount > 1
            ? html`
                <li class="page">
                  <sl-paginator-page
                    @click=${this.#onClick}
                    ?active=${this.page == this.pageCount}
                    aria-current=${ifDefined(this.page == this.pageCount ? 'page' : undefined)}
                    class="page"
                    fill="ghost"
                    size="lg"
                  >
                    ${this.pageCount}
                  </sl-paginator-page>
                </li>
              `
            : nothing}
        </ul>

        <div class="select-wrapper">
          <sl-select
            size="lg"
            @sl-change=${this.#onChange}
            value=${this.page}
            aria-label=${`${msg(str`${this.page}, page`)}`}
          >
            ${Array.from({ length: this.pageCount })?.map(
              (_, index) => html`
                <sl-select-option aria-label=${msg(str`${index + 1}, page`)} .value=${index + 1}>
                  ${index + 1}
                </sl-select-option>
              `
            )}
          </sl-select>
          <span>of ${this.pageCount} pages</span>
        </div>

        <sl-button
          @click=${this.#onNext}
          ?disabled=${this.page === this.pageCount}
          aria-label=${msg(str`Go to the next page (${this.page + 1})`)}
          class="next"
          fill="ghost"
          size="lg"
        >
          <sl-icon name="caret-right-solid"></sl-icon>
        </sl-button>
      </nav>

      <!-- We want this to be read every time the active page changes. -->
      <div id="live" aria-live="polite" aria-atomic="true">${msg(str`Page ${this.page} of ${this.pageCount}`)}</div>
    `;
  }

  #onChange(event: SlChangeEvent<number>): void {
    this.page = event.detail;
  }

  #onClick(event: Event) {
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

    this.#updateVisibility();

    requestAnimationFrame(() => {
      const activePageElement = this.renderRoot.querySelector('[active]') as PaginatorPage;
      const activeButton = activePageElement?.renderRoot.querySelector('button');
      activeButton?.focus();
    });
  }

  #onNext() {
    this.page = Math.min(this.page + 1, this.pageCount);
    this.pageChangeEvent.emit(this.page);
  }

  #onPrevious() {
    this.page = Math.max(this.page - 1, 1);
    this.pageChangeEvent.emit(this.page);
  }

  #onUpdate = (): void => {
    console.log('onUpdate');

    // this.pageSize = this.dataSource.page.pageSize;
    // if (this.totalItems === this.dataSource.page.totalItems) {
    //   this.page = this.dataSource.page.page;
    // }
    // this.totalItems = this.dataSource.page.totalItems;

    // this.#updateVisibility();
  };

  #updateVisibility(): void {
    const gap = parseInt(getComputedStyle(this).getPropertyValue('--_gap') || '0'),
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
      this.pageCount > this.visiblePageAmount /*11*/
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
}
