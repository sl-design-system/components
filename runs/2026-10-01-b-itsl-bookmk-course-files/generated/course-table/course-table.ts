import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { Tag } from '@sl-design-system/tag';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './course-table.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-itsl-files-course-select': SlItslFilesCourseSelectEvent;
    'sl-itsl-files-sort-change': SlItslFilesSortChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-itsl-files-course-table': CourseTable;
  }
}

/** The status of a course-files row. The visible label for each key lives in this component. */
export type CourseStatus = 'archived' | 'deleted';

/** The two columns that can be sorted; `course` and `status` are not sortable in this design. */
export type SortableColumnId = 'teacher' | 'lastUpdated';

/** The table's current sort, owned by this component as UI state (not part of the model). */
export interface SortState {
  columnId: SortableColumnId;
  direction: 'asc' | 'desc';
}

/** A single row of the course-files table. */
export interface CourseFileRow {
  id: string;
  /** Free text from the data source — rendered directly, not localized. */
  courseName: string;
  courseHref: string;
  status: CourseStatus;
  /** e.g. `['Floyd Miles', 'Jane Cooper', 'Wade Warren']` → "Floyd Miles and 2 more". */
  teacherNames: string[];
  /** ISO 8601 date, e.g. `'2024-04-05'`. Formatted as `DD/MM/YYYY` by this component. */
  lastUpdatedAt: string;
}

/** The model this component renders: every course-files row. */
export interface CourseTableModel {
  rows: CourseFileRow[];
}

/** The detail of the event emitted when a course link is activated. */
export interface CourseSelectDetail {
  id: string;
  href: string;
}

export type SlItslFilesCourseSelectEvent = CustomEvent<CourseSelectDetail>;
export type SlItslFilesSortChangeEvent = CustomEvent<SortState>;

/** Structural config: column order/labels/sortability. Not model data — see component-conventions. */
interface ColumnDef {
  id: 'course' | 'status' | 'teacher' | 'lastUpdated';
  label: string;
  sortable: boolean;
}

const COLUMNS: ColumnDef[] = [
  { id: 'course', label: 'Course', sortable: false },
  { id: 'status', label: 'Status', sortable: false },
  { id: 'teacher', label: 'Teacher', sortable: true },
  { id: 'lastUpdated', label: 'Last updated', sortable: true }
];

/** Structural config: the label shown for each status key. Not model data. */
const STATUS_LABELS: Record<CourseStatus, string> = {
  archived: 'Archived',
  deleted: 'Deleted'
};

/**
 * Structural constant, not domain data: lets this presentational component's story render with no
 * args, per the design's four visible rows. The data-owning `sl-itsl-files-page` passes a real
 * `model` fetched from `GET /api/courses/files`; it never relies on this default.
 */
const DEFAULT_MODEL: CourseTableModel = {
  rows: [
    {
      id: 'math-2c-1',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-1/files',
      status: 'archived',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    },
    {
      id: 'math-2c-2',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-2/files',
      status: 'deleted',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    },
    {
      id: 'math-2c-3',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-3/files',
      status: 'deleted',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    },
    {
      id: 'math-2c-4',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-4/files',
      status: 'archived',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    }
  ]
};

/**
 * European DD/MM/YYYY formatting — see the run's hard constraint on date locale.
 *
 * `timeZone: 'UTC'` is required, not cosmetic: a date-only ISO string (`'2024-04-05'`) parses as
 * UTC midnight, but `Intl.DateTimeFormat` with no `timeZone` formats in the runtime's *local*
 * zone — so on a host west of UTC (e.g. `America/New_York`) that midnight falls on the *previous*
 * local day and every row renders one day early. Pinning the formatter to UTC keeps the
 * date-only ISO input (midnight UTC) and the DD/MM/YYYY output in the same day, regardless of
 * where this runs.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC'
});

function formatLastUpdated(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso));
}

function formatTeachers(names: string[]): string {
  if (names.length === 0) {
    return '';
  } else if (names.length === 1) {
    return names[0];
  } else {
    return `${names[0]} and ${names.length - 1} more`;
  }
}

/**
 * Sorts a *copy* of `rows` by the given sort state — never mutates the array it's given (this
 * component's `model.rows` stays untouched; Lit would not see an in-place mutation as a change
 * anyway). `teacher` sorts on the first teacher name; `lastUpdated` sorts on the ISO date string
 * directly — ISO 8601 (`YYYY-MM-DD`) sorts correctly as a plain string, so no `Date` object (and
 * no timezone exposure) is needed here.
 */
function sortRows(rows: CourseFileRow[], sort?: SortState): CourseFileRow[] {
  if (!sort) {
    return rows;
  }

  const { columnId, direction } = sort,
    valueOf = (row: CourseFileRow): string =>
      columnId === 'teacher' ? (row.teacherNames[0] ?? '') : row.lastUpdatedAt,
    compare = (a: CourseFileRow, b: CourseFileRow): number => valueOf(a).localeCompare(valueOf(b));

  return [...rows].sort((a, b) => (direction === 'asc' ? compare(a, b) : compare(b, a)));
}

/**
 * The itslearning "course files" table: Course / Status / Teacher / Last updated, with sorting on
 * the last two columns.
 *
 * This is a presentational component — the data-owning `sl-itsl-files-page` passes it a `model`;
 * it never fetches anything itself. Sort direction is this component's own UI state: it sorts
 * `model.rows` itself before rendering (so `aria-sort` always matches the order shown — see
 * `sortRows`), and also emits `sl-itsl-files-sort-change` so a host that wants server-side sorting
 * can take over (re-sorting on the server is harmless here; this component's own sort of an
 * already-sorted array is a no-op).
 *
 * **Implementation note (Stage 4 discrepancy):** the decomposition's default was `sl-grid` +
 * `sl-grid-column` + `sl-grid-sort-column`. That was deliberately **not** taken here: `grid.ts`
 * pulls in `@lit-labs/virtualizer`, `sl-scrollbar`, `sl-tool-bar`, `sl-toggle-group` and
 * `sl-skeleton`, none of which this static 4-row design needs, and the decomposer itself rated
 * pixel-fidelity confidence for that route as low. Per the run's pre-authorised fallback, this
 * renders a plain semantic `<table>` in its own shadow DOM instead, with hand-written `aria-sort`
 * on the two sortable `<th>`s and a real `<a href>` for the course link.
 *
 * ```html
 * <sl-itsl-files-course-table .model=${model}></sl-itsl-files-course-table>
 * ```
 *
 * @fires sl-itsl-files-course-select - Emitted when a course link is activated; cancelable, so a
 *   host can `preventDefault()` to handle navigation itself instead of the native `<a>` following
 *   `href`.
 * @fires sl-itsl-files-sort-change - Emitted when the user changes the sort on a sortable column.
 */
export class CourseTable extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-tag': Tag
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The rows this table renders. */
  @property({ attribute: false }) model?: CourseTableModel = DEFAULT_MODEL;

  /** @internal The current sort; UI state owned by this component, not part of the model. */
  @state() sort?: SortState;

  /** @internal Emitted when a course link is activated. */
  @event({ name: 'sl-itsl-files-course-select', cancelable: true })
  courseSelectEvent!: EventEmitter<SlItslFilesCourseSelectEvent>;

  /** @internal Emitted when the sort changes. */
  @event({ name: 'sl-itsl-files-sort-change' })
  sortChangeEvent!: EventEmitter<SlItslFilesSortChangeEvent>;

  override render(): TemplateResult {
    const { rows } = this.model ?? DEFAULT_MODEL,
      sortedRows = sortRows(rows, this.sort);

    return html`
      <table>
        <thead>
          <tr>
            ${COLUMNS.map(column => this.#renderHeaderCell(column))}
          </tr>
        </thead>
        <tbody>
          ${sortedRows.map(row => this.#renderRow(row))}
        </tbody>
      </table>
    `;
  }

  #renderHeaderCell(column: ColumnDef): TemplateResult {
    if (!column.sortable) {
      return html`
        <th scope="col">
          <div class="th-inner">${column.label}</div>
        </th>
      `;
    }

    const columnId = column.id as SortableColumnId,
      active = this.sort?.columnId === columnId,
      direction = active ? this.sort?.direction : undefined,
      ariaSort = direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : undefined,
      iconName = direction === 'asc' ? 'sort-up' : direction === 'desc' ? 'sort-down' : 'sort';

    return html`
      <th aria-sort=${ifDefined(ariaSort)} scope="col">
        <div class="th-inner">
          <span>${column.label}</span>
          <sl-button
            @click=${() => this.#onSortClick(columnId)}
            aria-label="Sort by ${column.label}"
            fill="ghost">
            <sl-icon name=${iconName}></sl-icon>
          </sl-button>
        </div>
      </th>
    `;
  }

  #renderRow(row: CourseFileRow): TemplateResult {
    return html`
      <tr>
        <td>
          <div class="course-cell">
            <!-- Course-hat: design shows a graduation-cap glyph inside this circle, not
                 registered in the itslearning theme — see Icon Gaps. Left out, geometry (the 24px
                 circle via size="sm") preserved so nothing shifts. The circle's own design
                 background (#d9e3e8) also has no token anywhere in the repo, so this uses
                 sl-avatar's own default background instead of a hardcoded hex. -->
            <sl-avatar size="sm"></sl-avatar>
            <a
              @click=${(e: MouseEvent) => this.#onCourseClick(e, row)}
              class="course-link"
              href=${row.courseHref}>
              ${row.courseName}
            </a>
          </div>
        </td>
        <td>
          <div class="status-cell">
            <sl-tag class="status-tag">
              <!-- Design shows a circle-pen glyph here, not registered in the itslearning theme —
                   see Icon Gaps. Left out; this spacer preserves the 12x20px box the glyph
                   occupied so the label's start position doesn't shift. -->
              <span aria-hidden="true" class="status-glyph"></span>
              ${STATUS_LABELS[row.status]}
            </sl-tag>
          </div>
        </td>
        <td class="teacher-cell">${formatTeachers(row.teacherNames)}</td>
        <td class="last-updated-cell">${formatLastUpdated(row.lastUpdatedAt)}</td>
      </tr>
    `;
  }

  #onCourseClick(e: MouseEvent, row: CourseFileRow): void {
    const proceed = this.courseSelectEvent.emit({ id: row.id, href: row.courseHref });

    if (!proceed) {
      e.preventDefault();
    }
  }

  #onSortClick(columnId: SortableColumnId): void {
    const direction: SortState['direction'] =
      this.sort?.columnId === columnId && this.sort.direction === 'asc' ? 'desc' : 'asc';

    this.sort = { columnId, direction };
    this.sortChangeEvent.emit(this.sort);
  }
}

// This is the top-level element for this component, so it registers itself globally, guarded so
// re-importing this module (e.g. from the sibling `sl-itsl-files-page`) doesn't throw.
if (!customElements.get('sl-itsl-files-course-table')) {
  customElements.define('sl-itsl-files-course-table', CourseTable);
}
