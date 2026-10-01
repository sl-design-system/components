import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { InlineMessage, type SlDismissEvent } from '@sl-design-system/inline-message';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { SearchField, type SlSearchEvent } from '@sl-design-system/search-field';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  CourseFilesBulkActions,
  type SlCourseFilesBulkActionEvent,
  type SlCourseFilesClearSelectionEvent
} from './course-files-bulk-actions/course-files-bulk-actions.js';
import {
  CourseFilesPager,
  type SlCourseFilesPageChangeEvent,
  type SlCourseFilesPageSizeChangeEvent
} from './course-files-pager/course-files-pager.js';
import {
  type CourseFile,
  type CourseFilesSort,
  CourseFilesTable,
  type SlCourseFilesRowActionEvent,
  type SlCourseFilesSelectionChangeEvent,
  type SlCourseFilesSortChangeEvent
} from './course-files-table/course-files-table.js';
import {
  type AppNavModel,
  ItsAppNav,
  type SlItsAppNavNavigateEvent,
  type SlItsAppNavSearchEvent
} from './its-app-nav/its-app-nav.js';
import styles from './course-files-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-course-files-page': CourseFilesPage;
  }
}

/** One crumb in the page's breadcrumb trail. */
export interface CourseFilesPageBreadcrumb {
  id: string;
  label: string;
  href: string;
}

/** Everything the course files page renders. The root owns this; the children get slices of it. */
export interface CourseFilesPageData {
  navigation: AppNavModel;
  breadcrumbs: CourseFilesPageBreadcrumb[];
  heading: string;
  bannerText: string;
  files: CourseFile[];
  totalItems: number;
  selectableTotal: number;
}

/**
 * The design's own content, transcribed literally from the Figma frame
 * `Deleted course - content` (`4549:8339`).
 *
 * // TODO: a real implementation fetches this, e.g. GET /api/courses/{id}/files
 *
 * Every title, type label and "Last updated" string below is the design's placeholder copy, not
 * invented sample data — including `[assignment title]` and the design's own inconsistencies
 * (see `DESIGN_SELECTED_COUNT`).
 */
export const DEFAULT_DATA: CourseFilesPageData = {
  navigation: {
    primaryItems: [
      { id: 'courses', label: 'Courses', href: '#' },
      { id: 'updates', label: 'Updates', href: '#' },
      { id: 'groups', label: 'Groups', href: '#' },
      { id: 'calendar', label: 'Calendar', href: '#' },
      { id: 'library', label: 'Library', href: '#' }
    ],
    productLabel: 'Files',
    secondaryItems: [
      { id: 'your-files', label: 'Your files', href: '#' },
      { id: 'course-files', label: 'Course files', href: '#' }
    ],
    activeSecondaryId: 'course-files',
    userName: 'Hanna Nilsen'
  },
  breadcrumbs: [{ id: 'course-files', label: 'Course files', href: '#' }],
  heading: 'Social Studies 9A',
  bannerText:
    'This folder is created for the course "[name of the course]" you will find here all your work and important files.',
  files: [
    { id: 'f1', title: '[assignment title]', kind: 'assignment', lastUpdated: 'Last updated', href: '#' },
    { id: 'f2', title: '[assignment title]', kind: 'assignment', lastUpdated: 'Last updated', href: '#' },
    { id: 'f3', title: '[assignment title]', kind: 'assignment', lastUpdated: 'Last updated', href: '#' },
    { id: 'f4', title: 'resource title', kind: 'excel', lastUpdated: 'Last updated', href: '#' },
    { id: 'f5', title: '[assignment title]', kind: 'assignment', lastUpdated: 'Last updated', href: '#' },
    { id: 'f6', title: 'resource title', kind: 'word', lastUpdated: 'Last updated', href: '#' },
    { id: 'f7', title: 'resource title', kind: 'image', lastUpdated: 'Last updated', href: '#' },
    { id: 'f8', title: '[assignment title]', kind: 'assignment', lastUpdated: 'Last updated', href: '#' }
  ],
  totalItems: 47,
  selectableTotal: 40
};

/** The ids checked in the design: rows 1, 2 and 6. */
const DEFAULT_SELECTED_IDS = ['f1', 'f2', 'f6'];

/**
 * The count the bulk bar shows. The design is internally inconsistent: three row checkboxes are
 * checked but the bulk bar reads "2 selected out of 40". That literal is reproduced rather than
 * corrected, so the implementation matches the design pixel for pixel; `selectedIds.length` would
 * render "3" and silently diverge from the source of truth.
 */
const DESIGN_SELECTED_COUNT = 2;

/**
 * Structural config: the Actions menu's items. The menu is closed in the design, so its real
 * contents are unknown.
 *
 * // TODO: replace with the real Actions menu once the open state is designed.
 */
const ACTIONS_MENU_ITEMS = ['Move', 'Copy', 'Delete'] as const;

/** Structural config: the search field's placeholder, verbatim from the design. */
const SEARCH_PLACEHOLDER = 'Search [what user can search]';

/**
 * The itslearning "Course files" page: the global app chrome, a page header with a breadcrumb
 * trail and the course title, and a single white content card holding an informational banner, a
 * search field, an "Actions" menu button, the selectable files table, the bulk actions panel and
 * the pager.
 *
 * This is the root/page component and the only one in this run that registers globally. It owns
 * the data (a static mock transcribed from the design, with a comment marking where the real
 * fetch would go) and passes each presentational child only its own slice. It is also the
 * terminal handler for every child event — it updates its own UI state (selection, sort, page,
 * page size, banner dismissal) and never emits anything itself.
 *
 * ```html
 * <sl-course-files-page></sl-course-files-page>
 * ```
 */
export class CourseFilesPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-course-files-bulk-actions': CourseFilesBulkActions,
      'sl-course-files-pager': CourseFilesPager,
      'sl-course-files-table': CourseFilesTable,
      'sl-icon': Icon,
      'sl-inline-message': InlineMessage,
      'sl-its-app-nav': ItsAppNav,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The page's content. Defaults to the design's own data, so the story renders the Figma frame
   * with zero args.
   *
   * @default DEFAULT_DATA
   */
  @property({ attribute: false }) data: CourseFilesPageData = DEFAULT_DATA;

  /** @internal Local UI state: whether the informational banner has been dismissed. */
  @state() private bannerDismissed = false;

  /** @internal Local UI state: the 0-based index of the page being shown. */
  @state() private page = 0;

  /** @internal Local UI state: how many files are shown per page. */
  @state() private pageSize = 10;

  /** @internal Local UI state: the ids of the selected files, seeded from the design. */
  @state() private selectedIds: string[] = DEFAULT_SELECTED_IDS;

  /** @internal Local UI state: the column the table is sorted by; nothing is sorted in the design. */
  @state() private sort?: CourseFilesSort;

  /**
   * The selection is seeded from the design, so it is only valid for the design's own files. A
   * consumer that sets a different `data` would otherwise keep ids that no longer exist selected:
   * the bulk panel would claim a selection over an empty table. Pruning on every `data` change
   * keeps the selection a subset of what is actually rendered, which is what the panel's
   * visibility is keyed off.
   */
  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('data')) {
      this.selectedIds = this.selectedIds.filter(id => this.data.files.some(f => f.id === id));
    }
  }

  override render(): TemplateResult {
    const data = this.data;

    return html`
      <sl-its-app-nav
        .model=${data.navigation}
        @sl-its-app-nav-navigate=${this.#onNavigate}
        @sl-its-app-nav-search=${this.#onGlobalSearch}
      ></sl-its-app-nav>

      <div class="content-area">
        <div class="page-header">
          <nav aria-label="Breadcrumb" class="breadcrumbs">
            <ol>
              ${data.breadcrumbs.map(
                crumb => html`
                  <li>
                    <a href=${crumb.href}>${crumb.label}</a>
                    <sl-icon name="chevron-right" size="md" aria-hidden="true"></sl-icon>
                  </li>
                `
              )}
            </ol>
          </nav>
          <h1>${data.heading}</h1>
        </div>

        <div class="card">
          ${this.bannerDismissed
            ? nothing
            : html`
                <sl-inline-message @sl-dismiss=${this.#onBannerDismiss} variant="info">
                  ${data.bannerText}
                </sl-inline-message>
              `}

          <!--
            The design's controls are 40px tall. itslearning has no 40px control step: md measures 36px
            and lg measures 48px. lg is set per the Stage 4 rework directive; the 8px overshoot is
            reported rather than forced to 40px with CSS.
          -->
          <sl-search-field
            @sl-search=${this.#onSearch}
            aria-label=${SEARCH_PLACEHOLDER}
            placeholder=${SEARCH_PLACEHOLDER}
            size="md"
          ></sl-search-field>

          <!-- size: the design's controls are 40px. itslearning has no 40px step - md is 36px
               (1lh + 2x sl-size-100) and lg is 48px (1lh + 2x sl-size-175). md is kept because
               height error compounds down the page: md drifts the card 8px, lg drifts it 16px.
               Recorded as a Stage 4 discrepancy, not forced with CSS. -->
          <sl-menu-button fill="outline" size="md">
            <span slot="button">Actions</span>
            ${ACTIONS_MENU_ITEMS.map(label => html`<sl-menu-item>${label}</sl-menu-item>`)}
          </sl-menu-button>

          <sl-course-files-table
            .model=${{ files: data.files }}
            .selectedIds=${this.selectedIds}
            .sort=${this.sort}
            @sl-course-files-selection-change=${this.#onSelectionChange}
            @sl-course-files-sort-change=${this.#onSortChange}
            @sl-course-files-row-action=${this.#onRowAction}
          ></sl-course-files-table>

          ${this.selectedIds.length > 0
            ? html`
                <sl-course-files-bulk-actions
                  .model=${{
                    selectedCount: DESIGN_SELECTED_COUNT,
                    selectableTotal: data.selectableTotal
                  }}
                  @sl-course-files-bulk-action=${this.#onBulkAction}
                  @sl-course-files-clear-selection=${this.#onClearSelection}
                ></sl-course-files-bulk-actions>
              `
            : nothing}

          <sl-course-files-pager
            .model=${{ page: this.page, pageSize: this.pageSize, totalItems: data.totalItems }}
            @sl-course-files-page-change=${this.#onPageChange}
            @sl-course-files-page-size-change=${this.#onPageSizeChange}
          ></sl-course-files-pager>
        </div>
      </div>
    `;
  }

  #onNavigate(event: SlItsAppNavNavigateEvent): void {
    // This is an example app with no router; a real app would navigate to the selected item.
    console.info('App nav navigate', event.detail.itemId);
  }

  #onGlobalSearch(event: SlItsAppNavSearchEvent): void {
    // This is an example app with no backend; a real app would run the global search.
    console.info('Global search', event.detail);
  }

  #onSearch(event: SlSearchEvent): void {
    // This is an example app with no backend; a real app would filter `data.files` server-side.
    console.info('Course files search', event.detail);
  }

  /** `sl-inline-message` removes itself on dismiss; the flag keeps it gone across re-renders. */
  #onBannerDismiss(_event: SlDismissEvent): void {
    this.bannerDismissed = true;
  }

  /** The table emits the COMPLETE new selection, so it can be assigned straight back. */
  #onSelectionChange(event: SlCourseFilesSelectionChangeEvent): void {
    this.selectedIds = event.detail;
  }

  #onSortChange(event: SlCourseFilesSortChangeEvent): void {
    this.sort = event.detail;
  }

  #onRowAction(event: SlCourseFilesRowActionEvent): void {
    // This is an example app; a real app would open the row's overflow menu.
    console.info('Course file row action', event.detail.fileId);
  }

  #onBulkAction(event: SlCourseFilesBulkActionEvent): void {
    // This is an example app; a real app would download the selected files.
    console.info('Course files bulk action', event.detail.actionId);
  }

  /**
   * Clearing the selection removes the whole bulk actions panel from the DOM, which destroys the
   * "Clear selection" button the user just activated and would drop focus on `body`. Focus is
   * therefore moved deliberately once the update has settled. The search field is the target: it
   * is the first interactive control of the card, it lives in this component's own shadow root
   * (so no child's internals are reached into), and `SearchField` inherits `TextField`'s `focus()`
   * override, which forwards to its inner input.
   */
  async #onClearSelection(_event: SlCourseFilesClearSelectionEvent): Promise<void> {
    this.selectedIds = [];

    await this.updateComplete;

    this.renderRoot.querySelector<HTMLElement>('sl-search-field')?.focus();
  }

  #onPageChange(event: SlCourseFilesPageChangeEvent): void {
    this.page = event.detail;
  }

  /** Changing the page size invalidates the current offset, so paging restarts at the first page. */
  #onPageSizeChange(event: SlCourseFilesPageSizeChangeEvent): void {
    this.pageSize = event.detail;
    this.page = 0;
  }
}

customElements.get('sl-course-files-page') ??
  customElements.define('sl-course-files-page', CourseFilesPage);
