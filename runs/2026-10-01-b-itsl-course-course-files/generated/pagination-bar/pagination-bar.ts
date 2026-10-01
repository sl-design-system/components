import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './pagination-bar.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-itsl-pagination-page-change': SlItslPaginationPageChangeEvent;
    'sl-itsl-pagination-page-size-change': SlItslPaginationPageSizeChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-itsl-pagination-bar': PaginationBar;
  }
}

/** The data this component renders: domain values and stable keys only, no derived numbers. */
export interface PaginationModel {
  /** The current page, 1-based. */
  page: number;
  /** The number of items shown per page. */
  pageSize: number;
  /** The total number of items across every page. */
  totalItems: number;
}

export type SlItslPaginationPageChangeEvent = CustomEvent<number>;
export type SlItslPaginationPageSizeChangeEvent = CustomEvent<number>;

/** Structural config: the page-size choices offered in the select. Not model data. */
const PAGE_SIZES = [10, 25, 50, 100];

/** Structural config: how many page links are shown at once around the current page. */
const MAX_VISIBLE_PAGE_LINKS = 5;

/**
 * Structural constant, not domain data: lets this presentational component's story render with no
 * args, matching the design's "1 to 10 of 47" state. The data-owning `sl-itsl-course-files-page`
 * passes a real `model` derived from its fetched list; it never relies on this default.
 */
const DEFAULT_MODEL: PaginationModel = {
  page: 1,
  pageSize: 10,
  totalItems: 47
};

/** Returns the window of (1-based) page numbers to render as links around `page`. */
function getVisiblePages(page: number, pageCount: number): number[] {
  const count = Math.min(MAX_VISIBLE_PAGE_LINKS, pageCount);

  let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGE_LINKS / 2));
  const end = Math.min(pageCount, start + count - 1);

  start = Math.max(1, end - count + 1);

  return Array.from({ length: count }, (_, index) => start + index);
}

/**
 * The itslearning "course files" pagination bar: a page pager on the left, and the "x to y of z"
 * range plus a page-size select on the right.
 *
 * This is a presentational component — the data-owning `sl-itsl-course-files-page` passes it a
 * `model`; `pageCount` and the visible range are derived here in `render`, not stored as model
 * fields. It never fetches anything itself.
 *
 * **Implementation note (Stage 4 discrepancy).** The decomposition's default for this design was
 * composing `sl-paginator` + `sl-paginator-status` + `sl-paginator-page-size`. That was
 * deliberately **not** taken here — the decomposer verified four mismatches in those components'
 * source that aren't reachable through their public API: `sl-paginator` hardcodes
 * `caret-left-solid`/`caret-right-solid` (the design uses `chevron-left`/`chevron-right`),
 * `sl-paginator-status` emits `"1 - 10 of 47 items"` from a baked template literal (the design
 * says `"1 to 10 of 47"`), `sl-paginator-page-size` always renders a visible
 * `<sl-label>Items per page:</sl-label>` (the design has a bare select), and the selected-page
 * fill uses a theme colour that doesn't match the design's measured purple. This renders bespoke
 * markup instead, reusing `sl-button`, `sl-icon`, `sl-select` and `sl-option` as building blocks.
 *
 * ```html
 * <sl-itsl-pagination-bar .model=${model}></sl-itsl-pagination-bar>
 * ```
 *
 * @fires sl-itsl-pagination-page-change - Emitted with the new 1-based page number when the user
 *   activates the previous/next buttons or a page link.
 * @fires sl-itsl-pagination-page-size-change - Emitted with the new page size when the user
 *   changes the page-size select.
 */
export class PaginationBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-option': Option,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The current page, page size and total item count. */
  @property({ attribute: false }) model?: PaginationModel = DEFAULT_MODEL;

  /** @internal Emitted when the current page changes. */
  @event({ name: 'sl-itsl-pagination-page-change' })
  pageChangeEvent!: EventEmitter<SlItslPaginationPageChangeEvent>;

  /** @internal Emitted when the page size changes. */
  @event({ name: 'sl-itsl-pagination-page-size-change' })
  pageSizeChangeEvent!: EventEmitter<SlItslPaginationPageSizeChangeEvent>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'navigation');

    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', 'Pagination');
    }
  }

  override render(): TemplateResult {
    const { page, pageSize, totalItems } = this.model ?? DEFAULT_MODEL,
      pageCount = Math.max(1, Math.ceil(totalItems / pageSize)),
      start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1,
      end = Math.min(page * pageSize, totalItems),
      pages = getVisiblePages(page, pageCount);

    return html`
      <div class="pager">
        <sl-button
          @click=${() => this.#onPageClick(page - 1)}
          ?disabled=${page <= 1}
          aria-label="Previous page"
          fill="ghost">
          <sl-icon name="chevron-left"></sl-icon>
        </sl-button>
        ${pages.map(
          pageNumber => html`
            <button
              @click=${() => this.#onPageClick(pageNumber)}
              aria-current=${ifDefined(pageNumber === page ? 'page' : undefined)}
              class="page-link"
              type="button">
              ${pageNumber}
            </button>
          `
        )}
        <sl-button
          @click=${() => this.#onPageClick(page + 1)}
          ?disabled=${page >= pageCount}
          aria-label="Next page"
          fill="ghost">
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <div class="control">
        <span class="range">${start} to ${end} of ${totalItems}</span>
        <sl-select @sl-change=${this.#onPageSizeChange} aria-label="Items per page" .value=${pageSize}>
          ${PAGE_SIZES.map(size => html`<sl-option .value=${size}>${size}</sl-option>`)}
        </sl-select>
      </div>
    `;
  }

  #onPageClick(page: number): void {
    this.pageChangeEvent.emit(page);
  }

  #onPageSizeChange(e: SlChangeEvent<number | undefined>): void {
    if (typeof e.detail === 'number') {
      this.pageSizeChangeEvent.emit(e.detail);
    }
  }
}

// This is the top-level element for this component, so it registers itself globally, guarded so
// re-importing this module (e.g. from the sibling `sl-itsl-course-files-page`) doesn't throw.
if (!customElements.get('sl-itsl-pagination-bar')) {
  customElements.define('sl-itsl-pagination-bar', PaginationBar);
}
