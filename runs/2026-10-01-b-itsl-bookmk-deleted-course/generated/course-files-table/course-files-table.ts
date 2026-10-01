import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './course-files-table.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-course-files-row-action': SlCourseFilesRowActionEvent;
    'sl-course-files-selection-change': SlCourseFilesSelectionChangeEvent;
    'sl-course-files-sort-change': SlCourseFilesSortChangeEvent;
  }
}

/** The kind of file a row represents; drives the "Type" column label. */
export type CourseFileKind = 'assignment' | 'excel' | 'word' | 'image';

/** One file in the course files table. */
export interface CourseFile {
  id: string;
  title: string;
  kind: CourseFileKind;
  lastUpdated: string;
  href: string;
}

/** The slice of the page's domain model this table renders. */
export interface CourseFilesTableModel {
  files: CourseFile[];
}

/** The columns the table can be sorted by. */
export type CourseFilesSortColumn = 'title' | 'lastUpdated';

/** The direction a sortable column is sorted in. */
export type CourseFilesSortDirection = 'asc' | 'desc';

/** The table's current sort state. */
export interface CourseFilesSort {
  column: CourseFilesSortColumn;
  direction: CourseFilesSortDirection;
}

/** Emitted with the complete new selection whenever a row checkbox is toggled. */
export type SlCourseFilesSelectionChangeEvent = CustomEvent<string[]>;

/** Emitted with the requested sort when a sortable column header is activated. */
export type SlCourseFilesSortChangeEvent = CustomEvent<CourseFilesSort>;

/** Emitted when the per-row "More actions" button is activated. */
export type SlCourseFilesRowActionEvent = CustomEvent<{ fileId: string }>;

/**
 * Structural config: the columns this table renders, in order. Not model data — the parent says
 * *which files* there are, this component knows *what the columns are*.
 */
const COLUMNS = [
  { id: 'select', label: 'Select', sortable: false },
  { id: 'title', label: 'Title', sortable: true },
  { id: 'type', label: 'Type', sortable: false },
  { id: 'lastUpdated', label: 'Last updated', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false }
] as const;

/**
 * Structural config: the human-readable label for each file kind, shown in the "Type" column.
 * `'Excel '` keeps the trailing space it has in the design source.
 */
const KIND_LABEL: Record<CourseFileKind, string> = {
  assignment: 'Assignment',
  excel: 'Excel ',
  word: 'Word',
  image: 'Image'
};

/**
 * The course files table: a selectable, sortable list of the files in a course folder, with a
 * per-row overflow action.
 *
 * Presentational — the page owns the files, the selection and the sort state, passes them in, and
 * handles the events this component emits.
 *
 * ```html
 * <sl-course-files-table .model=${model} .selectedIds=${selectedIds}></sl-course-files-table>
 * ```
 *
 * @csspart table - The table element.
 * @csspart header-row - The column header row.
 * @csspart row - Every data row.
 * @csspart row-selected - Added to the data rows that are currently selected.
 *
 * @fires sl-course-files-selection-change - Emitted with the complete new selection when a row is toggled.
 * @fires sl-course-files-sort-change - Emitted when a sortable column header is activated.
 * @fires sl-course-files-row-action - Emitted when a row's "More actions" button is activated.
 */
export class CourseFilesTable extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-checkbox': Checkbox,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a row's "More actions" button is activated. */
  @event({ name: 'sl-course-files-row-action' })
  rowActionEvent!: EventEmitter<SlCourseFilesRowActionEvent>;

  /** @internal Emits the complete new selection when a row checkbox is toggled. */
  @event({ name: 'sl-course-files-selection-change' })
  selectionChangeEvent!: EventEmitter<SlCourseFilesSelectionChangeEvent>;

  /** @internal Emits the requested sort when a sortable column header is activated. */
  @event({ name: 'sl-course-files-sort-change' })
  sortChangeEvent!: EventEmitter<SlCourseFilesSortChangeEvent>;

  /** The files this table renders. */
  @property({ attribute: false }) model!: CourseFilesTableModel;

  /** The ids of the files that are currently selected. */
  @property({ attribute: false }) selectedIds: string[] = [];

  /** The column the table is currently sorted by, if any. */
  @property({ attribute: false }) sort?: CourseFilesSort;

  override render(): TemplateResult {
    const files = this.model?.files ?? [];

    return html`
      <table part="table" aria-label="Course files">
        <colgroup>
          ${COLUMNS.map(column => html`<col class=${`col-${column.id}`} />`)}
        </colgroup>
        <thead>
          <tr part="header-row">${COLUMNS.map(column => this.#renderHeaderCell(column))}</tr>
        </thead>
        <tbody>
          ${files.map(file => this.#renderRow(file))}
        </tbody>
      </table>
    `;
  }

  /**
   * The sort affordance's glyph in the design is `arrow-up-arrow-down`; `sort` is the equivalent
   * the itslearning theme registers, so that is what is rendered.
   */
  #renderHeaderCell(column: (typeof COLUMNS)[number]): TemplateResult {
    const sortable = column.sortable,
      // `aria-sort` belongs on the `<th>`, not on the button inside it. Nothing is sorted in the
      // design, so every sortable column renders `none` until the page sets `sort`.
      ariaSort = sortable ? this.#ariaSort(column.id as CourseFilesSortColumn) : undefined;

    return html`
      <th scope="col" aria-sort=${ariaSort ?? nothing}>
        <div class="th-inner">
          <span class="th-label">${column.label}</span>
          ${sortable
            ? html`
                <button
                  class="sort-button"
                  type="button"
                  aria-label=${`Sort by ${column.label}`}
                  @click=${() => this.#onSort(column.id as CourseFilesSortColumn)}
                >
                  <sl-icon name="sort" size="lg" aria-hidden="true"></sl-icon>
                </button>
              `
            : nothing}
        </div>
      </th>
    `;
  }

  /**
   * The design puts a full-colour product glyph (assignment, Excel, Word, image) on the 24x24 disc
   * in the title cell. Those are remote multi-tone Figma image assets, not `sl-icon` names, so the
   * bare disc is rendered — a hand-drawn substitute would corrupt the visual comparison.
   */
  #renderRow(file: CourseFile): TemplateResult {
    const selected = this.selectedIds.includes(file.id);

    return html`
      <tr part=${selected ? 'row row-selected' : 'row'} aria-selected=${selected ? 'true' : nothing}>
        <td class="select-cell">
          <sl-checkbox
            .checked=${selected}
            aria-label=${`Select ${file.title}`}
            @sl-change=${(event: Event) => this.#onToggle(file, (event.target as Checkbox).checked)}
          ></sl-checkbox>
        </td>
        <td class="title-cell">
          <div class="title-inner">
            <span class="file-kind" aria-hidden="true"></span>
            <a href=${file.href}>${file.title}</a>
          </div>
        </td>
        <td class="text-cell">${KIND_LABEL[file.kind]}</td>
        <td class="text-cell">${file.lastUpdated}</td>
        <td class="actions-cell">
          <button
            class="action-button"
            type="button"
            aria-haspopup="menu"
            aria-label=${`More actions for ${file.title}`}
            @click=${() => this.rowActionEvent.emit({ fileId: file.id })}
          >
            <sl-icon name="ellipsis" size="xl" aria-hidden="true"></sl-icon>
          </button>
        </td>
      </tr>
    `;
  }

  #ariaSort(column: CourseFilesSortColumn): 'ascending' | 'descending' | 'none' {
    if (this.sort?.column !== column) {
      return 'none';
    }

    return this.sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  /** Emits the COMPLETE new selection, not a delta, so the page can set it straight back. */
  #onToggle(file: CourseFile, checked?: boolean): void {
    // Set-dedupe: a duplicated sl-change would otherwise push the same id twice.
    const selectedIds = checked
      ? [...new Set([...this.selectedIds, file.id])]
      : this.selectedIds.filter(id => id !== file.id);

    this.selectionChangeEvent.emit(selectedIds);
  }

  /** Activating the column already sorted on flips its direction; any other column starts at `asc`. */
  #onSort(column: CourseFilesSortColumn): void {
    const direction: CourseFilesSortDirection =
      this.sort?.column === column && this.sort.direction === 'asc' ? 'desc' : 'asc';

    this.sortChangeEvent.emit({ column, direction });
  }
}
