import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './course-table.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-itsl-sort': SlItslSortEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-itsl-course-table': CourseTable;
  }
}

/** The status of a course row; stable key, not the visible label (that lives in this component). */
export type CourseStatus = 'archived' | 'deleted';

/** The columns that can be sorted. */
export type SortableColumnId = 'teacher' | 'lastUpdated';

/** A single row of the course table. */
export interface CourseRow {
  id: string;
  /** Free text from the data source — rendered directly, not localized. */
  name: string;
  href?: string;
  status: CourseStatus;
  teacher: string;
  lastUpdated: string;
}

/** The model this component renders. */
export interface CourseTableModel {
  rows: CourseRow[];
  sort?: { column: SortableColumnId; direction: 'asc' | 'desc' };
}

/** The detail of the event emitted when the user changes the sort of a sortable column. */
export interface SortDetail {
  column: string;
  direction: 'asc' | 'desc';
}

export type SlItslSortEvent = CustomEvent<SortDetail>;

/** Structural config: column order/labels/sortability — not model data, see component-conventions. */
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

/**
 * The itslearning "Save course materials" table: Course / Status / Teacher / Last updated, with
 * sorting on the last two columns.
 *
 * This is a presentational component — the data-owning `sl-itsl-course-files-page` passes it a
 * `model`; it never fetches anything itself. The current sort is part of the `model` (owned by the
 * parent); this component only emits `sl-itsl-sort` when a sortable header is activated, it does
 * not mutate its own state.
 *
 * **Implementation note (Stage 4 discrepancy):** the decomposition's default was `sl-grid`. That
 * was deliberately **not** taken here: matching this design with `sl-grid` needs three *private*
 * custom-property overrides (`--_border-width`, `--_body-cell-padding-block`,
 * `--_head-cell-padding-block`), which is worse than a real semantic `<table>`. See the manifest's
 * OQ-1.
 *
 * **Course Hat badge:** the design's `graduation-cap` glyph is not registered in the itslearning
 * theme, and its exact fill/glyph colors (`#d9e3e8`/`#72838d`) have no token in this theme either.
 * This renders an empty circle (nearest token for the fill) with no glyph inside, preserving the
 * row's geometry — see the manifest's OQ-11.
 *
 * ```html
 * <sl-itsl-course-table .model=${model}></sl-itsl-course-table>
 * ```
 *
 * @fires sl-itsl-sort - Emitted when the user activates a sortable column header.
 */
export class CourseTable extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-badge': Badge,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The rows this table renders, and the current sort (owned by the parent). */
  @property({ attribute: false }) model?: CourseTableModel;

  /** @internal Emitted when the user activates a sortable column header. */
  @event({ name: 'sl-itsl-sort' }) sortEvent!: EventEmitter<SlItslSortEvent>;

  override render(): TemplateResult {
    const rows = this.model?.rows ?? [];

    return html`
      <table>
        <thead>
          <tr>
            ${COLUMNS.map(column => this.#renderHeaderCell(column))}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => this.#renderRow(row))}
        </tbody>
      </table>
    `;
  }

  #renderHeaderCell(column: ColumnDef): TemplateResult {
    if (!column.sortable) {
      return html`<th scope="col">${column.label}</th>`;
    }

    const columnId = column.id as SortableColumnId,
      active = this.model?.sort?.column === columnId,
      direction = active ? this.model?.sort?.direction : undefined,
      ariaSort = direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none';

    return html`
      <th aria-sort=${ariaSort} scope="col">
        <button @click=${() => this.#onSortClick(columnId)} type="button">
          ${column.label}
          <sl-icon name="sort"></sl-icon>
        </button>
      </th>
    `;
  }

  #renderRow(row: CourseRow): TemplateResult {
    return html`
      <tr>
        <td>
          <div class="course-cell">
            <!-- Course-hat: the design's graduation-cap glyph is not registered in the
                 itslearning theme, so this renders an empty circle — see the class JSDoc. -->
            <span aria-hidden="true" class="course-hat"></span>
            <a class="course-link" href=${ifDefined(row.href)}>${row.name}</a>
          </div>
        </td>
        <td>
          <sl-badge class="status-badge">${this.#statusLabel(row.status)}</sl-badge>
        </td>
        <td class="teacher-cell">${row.teacher}</td>
        <td class="last-updated-cell">${row.lastUpdated}</td>
      </tr>
    `;
  }

  #statusLabel(status: CourseStatus): string {
    switch (status) {
      case 'archived':
        return 'Archived';
      case 'deleted':
        return 'Deleted';
    }
  }

  #onSortClick(column: SortableColumnId): void {
    const current = this.model?.sort,
      direction: 'asc' | 'desc' =
        current?.column === column && current.direction === 'asc' ? 'desc' : 'asc';

    this.sortEvent.emit({ column, direction });
  }
}

// This is the top-level element for this component, so it registers itself globally, guarded so
// re-importing this module (e.g. from the sibling `sl-itsl-course-files-page`) doesn't throw.
if (!customElements.get('sl-itsl-course-table')) {
  customElements.define('sl-itsl-course-table', CourseTable);
}
