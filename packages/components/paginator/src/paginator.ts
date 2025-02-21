import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { DATA_SOURCE_DEFAULT_PAGE_SIZE, type ListDataSource } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem } from '@sl-design-system/menu';
import { Select, SelectOption } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './paginator.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-change': SlChangeEvent<number>;
  }

  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}

const PAGINATOR_SIZES: { [key in PaginatorWidth]: number } = {
  xs: 6,
  sm: 7,
  md: 9,
  lg: 11
} as const;

export type PaginatorSize = 'sm' | 'md' | 'lg';

export type PaginatorWidth = 'xs' | 'sm' | 'md' | 'lg';

export type PaginatorEmphasis = 'subtle' | 'bold';

export type PaginatorVariant = 'ghost' | 'outline';

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
      'sl-select': Select,
      'sl-select-option': SelectOption
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The data source that the paginator controls. */
  #dataSource?: ListDataSource<T>;

  /** Observe changes in size of the container. */
  #observer = new ResizeObserver(entries => this.#onResize(entries[0]));

  /** The original size, before any resize observer logic. */
  // #originalSize?: PaginatorSize;
  #originalWidth?: PaginatorWidth;

  /** The current size. */
  #width?: PaginatorWidth;

  get dataSource(): ListDataSource<T> | undefined {
    return this.#dataSource;
  }

  /**
   * By setting a dataSource, the paginator will listen for changes on the data source
   * and control the data source when the user selects a new page in the component. This
   * can be very useful when the paginator is used in combination with a data source fed
   * component, such as `<sl-grid>`.
   */
  @property({ attribute: false })
  set dataSource(dataSource: ListDataSource<T> | undefined) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.#onUpdate);
    }

    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);

    void this.#onUpdate();
  }

  /**
   * The emphasis style.
   * @default 'subtle'
   */
  @property({ reflect: true }) emphasis?: PaginatorEmphasis;

  /**
   * Current page.
   * @default 0
   */
  @property({ type: Number }) page = 0;

  /** @internal Emits when the page has been changed. */
  @event({ name: 'sl-page-change' }) pageChangeEvent!: EventEmitter<SlChangeEvent<number>>;

  /** @internal The total number of pages. */
  @state() pageCount = 1;

  /**
   * Items per page. Default to the first item of pageSizes.
   * @default 10
   */
  @property({ type: Number, attribute: 'page-size' }) pageSize = DATA_SOURCE_DEFAULT_PAGE_SIZE;

  // TODO: width instead of size

  get width(): PaginatorWidth | undefined {
    return this.#width;
  }

  /**
   * The width of the paginator. This is used to determine how many pages are visible at once.
   * For `xs` a select component will be used to select the page. For all other widths,
   * buttons will be used.
   */
  @property({ reflect: true })
  set width(value: PaginatorWidth | undefined) {
    this.#originalWidth = value;
    this.#width = value;
  }

  /**
   * The size of the paginator.
   * @default md
   */
  @property({ reflect: true }) size?: PaginatorSize;

  /**
   * Total number of items.
   * @default 1
   */
  @property({ type: Number, attribute: 'total-items' }) totalItems = 1;

  /**
   * The fill of the paginator.
   * @default 'ghost'
   */
  @property({ reflect: true }) fill?: PaginatorVariant; // TODO: really subtle is the default one?, maybe fill instead of variant?

  /** @internal The index of the start of the sliding window. */
  @state() windowStart = 0;

  /** @internal The index of the end of the sliding window. */
  @state() windowEnd = Infinity;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', msg(str`Pagination`));
    }

    this.setAttribute('role', 'navigation');

    this.dataSource?.addEventListener('sl-update', this.#onUpdate);
    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.dataSource?.removeEventListener('sl-update', this.#onUpdate);

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('page') || changes.has('pageSize') || changes.has('totalItems')) {
      this.pageSize ??= DATA_SOURCE_DEFAULT_PAGE_SIZE;
      this.pageCount = Math.ceil(this.totalItems / this.pageSize) || 1;
      this.page = Math.min(Math.max(this.page, 0), this.pageCount - 1);

      this.#updateVisibility();
    }

    if (changes.has('width')) {
      // TODO: plus probably suze change as well
      this.#updateVisibility();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-button
        @click=${this.#onPrevious}
        ?disabled=${this.page === 0}
        aria-label=${msg(str`Go to the previous page (${this.page})`)}
        class="nav"
        fill=${this.fill ? this.fill : 'ghost'}
        size=${this.size ? this.size : 'md'}
      >
        <sl-icon name="caret-left-solid"></sl-icon>
      </sl-button>

      <sl-button
        @click=${() => this.#onPageClick(0)}
        aria-current=${ifDefined(this.page === 0 ? 'page' : undefined)}
        class=${classMap({ current: this.page === 0, page: true })}
        fill=${this.fill ? this.fill : 'ghost'}
        size=${this.size ? this.size : 'md'}
      >
        1
      </sl-button>

      ${this.windowStart > 0
        ? html`
            <sl-menu-button
              aria-label=${msg('Select page number')}
              fill=${this.fill ? this.fill : 'ghost'}
              size=${this.size ? this.size : 'md'}
            >
              <sl-icon name="ellipsis-down" slot="button"></sl-icon>
              ${Array.from({ length: this.windowStart + 1 }).map(
                (_, i) => html`<sl-menu-item @click=${() => this.#onPageClick(i + 1)}>${i + 2}</sl-menu-item>`
              )}
            </sl-menu-button>
          `
        : nothing}
      ${Array.from({ length: this.pageCount - 2 }).map(
        (_, index) => html`
          <sl-button
            @click=${() => this.#onPageClick(index + 1)}
            aria-current=${ifDefined(this.page === index + 1 ? 'page' : undefined)}
            class=${classMap({ current: this.page === index + 1, page: true })}
            fill=${this.fill ? this.fill : 'ghost'}
            size=${this.size ? this.size : 'md'}
            style=${styleMap({
              display: index <= this.windowStart || index >= this.windowEnd ? 'none' : undefined
            })}
          >
            ${index + 2}
          </sl-button>
        `
      )}
      ${this.windowEnd < this.pageCount - 2
        ? html`
            <sl-menu-button
              aria-label=${msg('Select page number')}
              fill=${this.fill ? this.fill : 'ghost'}
              size=${this.size ? this.size : 'md'}
            >
              <sl-icon name="ellipsis-down" slot="button"></sl-icon>
              ${Array.from({ length: this.pageCount - this.windowEnd - 2 }).map(
                (_, i) => html`
                  <sl-menu-item @click=${() => this.#onPageClick(i + this.windowEnd + 1)}>
                    ${i + this.windowEnd + 2}
                  </sl-menu-item>
                `
              )}
            </sl-menu-button>
          `
        : nothing}

      <sl-button
        @click=${() => this.#onPageClick(this.pageCount - 1)}
        aria-current=${ifDefined(this.page === this.pageCount - 1 ? 'page' : undefined)}
        class=${classMap({ current: this.page === this.pageCount - 1, page: true })}
        fill=${this.fill ? this.fill : 'ghost'}
        size=${this.size ? this.size : 'md'}
      >
        ${this.pageCount}
      </sl-button>

      <div class="wrapper">
        <sl-select
          @sl-change=${this.#onChange}
          .value=${this.page}
          aria-label=${`${msg(str`${this.page}, page`)}`}
          size=${this.size ? this.size : 'md'}
        >
          ${Array.from({ length: this.pageCount }).map(
            (_, index) => html`
              <sl-select-option aria-label=${msg(str`${index + 1}, page`)} .value=${index}>
                ${index + 1}
              </sl-select-option>
            `
          )}
        </sl-select>
        <span>of ${this.pageCount} pages</span>
      </div>

      <sl-button
        @click=${this.#onNext}
        ?disabled=${this.page === this.pageCount - 1}
        aria-label=${msg(str`Go to the next page (${this.page + 2})`)}
        class="nav"
        fill=${this.fill ? this.fill : 'ghost'}
        size=${this.size ? this.size : 'md'}
      >
        <sl-icon name="caret-right-solid"></sl-icon>
      </sl-button>
    `;
  }

  // TODO: variant (fill), emphasis, sizes sm, md, lg???

  #onChange(event: SlChangeEvent<number>): void {
    this.#onPageClick(event.detail);
  }

  #onNext() {
    this.#onPageClick(Math.min(this.page + 1, this.pageCount - 1), true);
  }

  #onPageClick(page: number, announcePage = false): void {
    this.page = page;
    this.pageChangeEvent.emit(this.page);

    if (this.dataSource) {
      this.dataSource.setPage(this.page);
      this.dataSource.update();
    }

    this.#updateVisibility();

    if (announcePage) {
      announce(msg(str`Page ${this.page + 1} of ${this.pageCount}`));
    }
  }

  #onPrevious() {
    this.#onPageClick(Math.max(this.page - 1, 0), true);
  }

  #onResize(entry: ResizeObserverEntry): void {
    const buttonSize = parseInt(getComputedStyle(this).getPropertyValue('--sl-size-500')) || 0,
      gap = parseInt(getComputedStyle(this).gap, 10) || 0;

    if (buttonSize && gap) {
      const count = Math.floor(entry.contentRect.width / (buttonSize + gap)) - 2,
        [width, visiblePages] = Object.entries(PAGINATOR_SIZES).find(([, value]) => count <= value) || [
          'lg',
          PAGINATOR_SIZES['lg']
        ];

      if (this.#originalWidth) {
        // We can go smaller than the original size, but never larger
        if (visiblePages <= PAGINATOR_SIZES[this.#originalWidth]) {
          this.#width = width as PaginatorWidth;
        }
      } else {
        this.#width = width as PaginatorWidth;
      }

      this.requestUpdate('width');
    }
  }

  #onUpdate = async (): Promise<void> => {
    const { page, pageSize, size } = this.dataSource!;

    // If the page remains the same, but the pageSize or size has changed,
    // we need to reset the page to the first page.
    if (this.page === page && (this.pageSize !== pageSize || this.totalItems !== size)) {
      // Prevent an infinite loop
      this.pageSize = pageSize;
      this.totalItems = size;

      // Wait for the update, so pageCount is updated
      await this.updateComplete;

      this.#onPageClick(0, true);

      return;
    }

    this.page = page ?? 0;
    this.pageSize = pageSize;
    this.totalItems = size;
  };

  #updateVisibility(): void {
    const { page, pageCount } = this,
      visiblePageCount = PAGINATOR_SIZES[this.width || 'lg'],
      count = Math.floor(visiblePageCount / 2);

    this.windowStart = Math.min(Math.max(page - count, 0), pageCount - visiblePageCount) || -1;

    if (page >= pageCount - count - 1) {
      this.windowEnd = pageCount - 2;
    } else {
      this.windowEnd = Math.min(Math.max(page, count) + count - 2, pageCount - 1);
    }
  }
}
