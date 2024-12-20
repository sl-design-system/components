import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { type DataSource } from '@sl-design-system/data-source';
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
    'sl-page-change': SlChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}

const PAGINATOR_SIZES = {
  xs: 6,
  sm: 7,
  md: 9,
  lg: 11
} as const;

export type PaginatorSize = 'xs' | 'sm' | 'md' | 'lg';

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
  #dataSource?: DataSource<T>;

  /** Observe changes in size of the container. */
  #observer = new ResizeObserver(entries => this.#onResize(entries[0]));

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

  /** @internal The index from which the pages will be shown. */
  @state() overflowStart = 0;

  /** @internal The index from which the pages will be hidden.*/
  @state() overflowEnd = Infinity;

  /** Current page. */
  @property({ type: Number }) page = 0;

  /** @internal Emits when the page has been changed. */
  @event({ name: 'sl-page-change' }) pageChangeEvent!: EventEmitter<SlChangeEvent<number>>;

  /** @internal The total number of pages. */
  @property({ type: Number, attribute: 'page-count' }) pageCount = 1;

  /**
   * Items per page. Default to the first item of pageSizes.
   * @default 10
   */
  @property({ type: Number, attribute: 'page-size' }) pageSize = 10;

  /**
   * The size of the paginator. This is used to determine how many pages are visible at once.
   * For `xs` a select component will be used to select the page. For all other sizes,
   * buttons will be used.
   */
  @property({ reflect: true }) size?: PaginatorSize;

  /** Total amount of items. */
  @property({ type: Number, attribute: 'total-items' }) totalItems = 1;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('aria-label', msg(str`Pagination`));
    this.setAttribute('role', 'navigation');

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

    if (changes.has('page') || changes.has('pageSize') || changes.has('totalItems')) {
      this.pageSize ??= 10;
      this.pageCount = Math.ceil(this.totalItems / this.pageSize) || 1;
      this.page = Math.min(Math.max(this.page, 0), this.pageCount - 1);

      this.#updateVisibility();
    }

    if (changes.has('size')) {
      this.#updateVisibility();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-button
        @click=${this.#onPrevious}
        ?disabled=${this.page === 0}
        aria-label=${msg(str`Go to the previous page (${this.page})`)}
        fill="ghost"
        size="lg"
      >
        <sl-icon name="caret-left-solid"></sl-icon>
      </sl-button>

      <sl-button
        @click=${() => this.#onPageClick(0)}
        aria-current=${ifDefined(this.page === 0 ? 'page' : undefined)}
        class=${classMap({ current: this.page === 0, page: true })}
        fill="ghost"
        size="lg"
      >
        1
      </sl-button>

      ${this.overflowStart > 0
        ? html`
            <sl-menu-button aria-label=${msg('Select page number')} fill="ghost" size="lg">
              <sl-icon name="ellipsis-down" slot="button"></sl-icon>
            </sl-menu-button>
          `
        : nothing}
      ${Array.from({ length: this.pageCount - 2 }).map(
        (_, index) => html`
          <sl-button
            @click=${() => this.#onPageClick(index + 1)}
            aria-current=${ifDefined(this.page === index + 1 ? 'page' : undefined)}
            class=${classMap({ current: this.page === index + 1, page: true })}
            fill="ghost"
            size="lg"
            style=${styleMap({
              display: index <= this.overflowStart || index >= this.overflowEnd ? 'none' : undefined
            })}
          >
            ${index + 2}
          </sl-button>
        `
      )}
      ${this.overflowEnd < this.pageCount - 2
        ? html`
            <sl-menu-button aria-label=${msg('Select page number')} fill="ghost" size="lg">
              <sl-icon name="ellipsis-down" slot="button"></sl-icon>
            </sl-menu-button>
          `
        : nothing}

      <sl-button
        @click=${() => this.#onPageClick(this.pageCount - 1)}
        aria-current=${ifDefined(this.page === this.pageCount - 1 ? 'page' : undefined)}
        class=${classMap({ current: this.page === this.pageCount - 1, page: true })}
        fill="ghost"
        size="lg"
      >
        ${this.pageCount}
      </sl-button>

      <div class="wrapper">
        <sl-select
          @sl-change=${this.#onChange}
          .value=${this.page}
          aria-label=${`${msg(str`${this.page}, page`)}`}
          size="lg"
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
        fill="ghost"
        size="lg"
      >
        <sl-icon name="caret-right-solid"></sl-icon>
      </sl-button>
    `;
  }

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
      announce(msg(str`Page ${this.page} of ${this.pageCount}`));
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
        [size, _] = Object.entries(PAGINATOR_SIZES).find(([, value]) => count <= value) || ['lg', 0];

      this.size = size as PaginatorSize;
    }
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
    const { page, pageCount } = this,
      visiblePageCount = PAGINATOR_SIZES[this.size || 'lg'],
      count = Math.floor(visiblePageCount / 2);

    this.overflowStart = Math.min(Math.max(page - count, 0), pageCount - visiblePageCount) || -1;

    if (page >= pageCount - count - 1) {
      this.overflowEnd = pageCount - 2;
    } else {
      this.overflowEnd = Math.min(Math.max(page, count) + count - 2, pageCount - 1);
    }
  }
}
