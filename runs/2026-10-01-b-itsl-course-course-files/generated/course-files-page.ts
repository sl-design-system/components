import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { InlineMessage } from '@sl-design-system/inline-message';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
// Value imports, because this host uses ScopedElementsMixin and resolves its children through
// its own registry (`scopedElements` below) — the CLASS is what that map needs. The children
// also self-register globally, but only so their standalone stories can render; that is a
// deliberate deviation from component-conventions.md's "a child used only inside a larger
// component must not register itself".
import {
  CourseTable,
  type CourseRow,
  type SlItslSortEvent,
  type SortableColumnId
} from './course-table/course-table.js';
import {
  PaginationBar,
  type PaginationModel,
  type SlItslPaginationPageChangeEvent,
  type SlItslPaginationPageSizeChangeEvent
} from './pagination-bar/pagination-bar.js';
import { TopNav, type TopNavModel } from './top-nav/top-nav.js';
import {
  DEMO_BANNER_TEXT,
  DEMO_NAV,
  DEMO_PAGE_TITLE,
  DEMO_PAGINATION,
  DEMO_ROWS
} from './demo-data.js';
import styles from './course-files-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-itsl-course-files-page': CourseFilesPage;
  }
}

/** Everything the page renders. The page owns it; each child gets only its own slice. */
export interface CourseFilesPageData {
  nav: TopNavModel;
  title: string;
  bannerText: string;
  rows: CourseRow[];
  /** The table's current sort. Owned here, because the page owns the data it sorts. */
  sort?: { column: SortableColumnId; direction: 'asc' | 'desc' };
  pagination: PaginationModel;
}

const DEFAULT_DATA: CourseFilesPageData = {
  nav: DEMO_NAV,
  title: DEMO_PAGE_TITLE,
  bannerText: DEMO_BANNER_TEXT,
  rows: DEMO_ROWS,
  pagination: DEMO_PAGINATION
};

/**
 * The itslearning "Save course materials" page: the two-tier product shell, a page title, and a
 * white content block holding a dismissible info banner, a table of course files, and a
 * pagination bar.
 *
 * This is the root / data-owning component. It holds the demo data (see `./demo-data.ts` for
 * where a real fetch would go) and passes each child a single cohesive model object. It renders
 * the whole design with no arguments: `<sl-itsl-course-files-page></sl-itsl-course-files-page>`.
 */
export class CourseFilesPage extends ScopedElementsMixin(LitElement) {
  /**
   * `ScopedElementsMixin` gives this host its own element registry. A tag missing from this map
   * stays an inert unknown element while the host paints — the page looks plausible in a
   * screenshot and is actually empty. Every tag used in `render` must be listed here.
   */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-inline-message': InlineMessage,
      'sl-itsl-course-pagination-bar': PaginationBar,
      'sl-itsl-course-table': CourseTable,
      'sl-itsl-course-top-nav': TopNav
    };
  }

  static override styles: CSSResultGroup = styles;

  /** The page's data. Defaults to the demo records so the story needs no arguments. */
  @property({ attribute: false }) data: CourseFilesPageData = { ...DEFAULT_DATA };

  /**
   * The children emit upward and the page owns the state, so every handler REPLACES `this.data`
   * with a new object. Mutating it in place would both skip Lit's dirty check and, because the
   * demo records are module-level, corrupt the defaults for every other instance on the page.
   */
  #onSort(event: SlItslSortEvent): void {
    const { column, direction } = event.detail;

    this.data = { ...this.data, sort: { column: column as SortableColumnId, direction } };
  }

  #onPageChange(event: SlItslPaginationPageChangeEvent): void {
    this.data = { ...this.data, pagination: { ...this.data.pagination, page: event.detail } };
  }

  #onPageSizeChange(event: SlItslPaginationPageSizeChangeEvent): void {
    // A new page size invalidates the current page, so go back to the first.
    this.data = {
      ...this.data,
      pagination: { ...this.data.pagination, page: 1, pageSize: event.detail }
    };
  }

  override render(): TemplateResult {
    const { nav, title, bannerText, rows, sort, pagination } = this.data;

    return html`
      <sl-itsl-course-top-nav .model=${nav}></sl-itsl-course-top-nav>

      <div class="content-area">
        <h1>${title}</h1>

        <div class="content-block">
          <sl-inline-message variant="info">${bannerText}</sl-inline-message>

          <sl-itsl-course-table
            .model=${{ rows, sort }}
            @sl-itsl-course-sort=${this.#onSort}
          ></sl-itsl-course-table>

          <sl-itsl-course-pagination-bar
            .model=${pagination}
            @sl-itsl-course-pagination-page-change=${this.#onPageChange}
            @sl-itsl-course-pagination-page-size-change=${this.#onPageSizeChange}
          ></sl-itsl-course-pagination-bar>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('sl-itsl-course-files-page')) {
  customElements.define('sl-itsl-course-files-page', CourseFilesPage);
}
