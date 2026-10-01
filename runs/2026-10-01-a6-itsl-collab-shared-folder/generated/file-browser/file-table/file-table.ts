import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './file-table.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a6-file-selection-change': SlA6FileSelectionChangeEvent;
    'sl-a6-file-sort-change': SlA6FileSortChangeEvent;
    'sl-a6-file-row-action': SlA6FileRowActionEvent;
  }
}

/** What kind of file a row holds; selects both the type label and the badge glyph. */
export type FileKind = 'document' | 'spreadsheet' | 'presentation';

/** Which column the table is sorted by. */
export type FileSortField = 'title' | 'published' | 'type';

export type SortDirection = 'asc' | 'desc';

export interface FileSort {
  field: FileSortField;
  direction: SortDirection;
}

/** One file in the folder. */
export interface FileRow {
  id: string;
  title: string;
  kind: FileKind;
  /** ISO 8601 date; this component formats it. */
  publishedAt: string;
  publishedBy: string;
  href: string;
}

/** The data this component renders; owned by `sl-a6-file-browser`. */
export interface FileTableModel {
  files: FileRow[];
  selectedIds: string[];
  sort?: FileSort;
}

export type SlA6FileSelectionChangeEvent = CustomEvent<{ selectedIds: string[] }>;
export type SlA6FileSortChangeEvent = CustomEvent<FileSort>;
export type SlA6FileRowActionEvent = CustomEvent<{ fileId: string }>;

/**
 * The human label for each file kind. Structure, not data: the model carries the stable `kind`
 * key and this component owns the wording.
 */
const KIND_LABEL: Record<FileKind, string> = {
  document: 'Document',
  spreadsheet: 'Spreadsheet',
  presentation: 'Presentation'
};

/**
 * The column set: order, header label, and whether the column is sortable. Structure, not data —
 * the parent never configures this.
 */
const COLUMNS: ReadonlyArray<{ key: string; label: string; sort?: FileSortField }> = [
  { key: 'select', label: 'Select' },
  { key: 'title', label: 'Title', sort: 'title' },
  { key: 'published', label: 'Published', sort: 'published' },
  { key: 'type', label: 'Type', sort: 'type' },
  { key: 'actions', label: 'Actions' }
];

/**
 * Explicit `en-GB` so the rendered date does not drift with the ambient locale: the design shows
 * `12/05/2025`, which `en-US` would render as `5/12/2025` on the same instant.
 */
const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

/**
 * Figma `table` `4411:11853`, 664 x 608 — the folder's file list: a 32px header row and eight
 * 72px data rows over Select / Title / Published / Type / Actions.
 *
 * Presentational. `selectedIds` and `sort` arrive on the `model` and are owned by
 * `sl-a6-file-browser`; this component emits changes and never mutates its own copy.
 *
 * **`sl-grid` is deliberately not used.** Matching this design through it needs four *private*
 * custom properties — `--_border-width` (it paints 2px where the design has a 1px hairline),
 * `--_body-cell-padding-block`, `--_head-cell-padding-block` and `--_head-cell-background` — and
 * its `thead`/`tbody` take a full box border plus radius where this design has only per-row
 * bottom rules. Reaching past a public API is not allowed here, and two earlier itslearning runs
 * reached the same conclusion independently, so this is a real `<table>`.
 *
 * ```html
 * <sl-a6-file-table .model=${model}></sl-a6-file-table>
 * ```
 *
 * @fires sl-a6-file-selection-change - Emitted with the full selected-id list when a row checkbox toggles.
 * @fires sl-a6-file-sort-change - Emitted when a sortable column header is activated.
 * @fires sl-a6-file-row-action - Emitted with the file id when a row's action button is activated.
 */
export class A6FileTable extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The files, which are selected, and the current sort. */
  @property({ attribute: false }) model?: FileTableModel;

  /** @internal Emits the full selected-id list when a row checkbox toggles. */
  @event({ name: 'sl-a6-file-selection-change' })
  selectionChangeEvent!: EventEmitter<SlA6FileSelectionChangeEvent>;

  /** @internal Emits when a sortable column header is activated. */
  @event({ name: 'sl-a6-file-sort-change' })
  sortChangeEvent!: EventEmitter<SlA6FileSortChangeEvent>;

  /** @internal Emits the file id when a row's action button is activated. */
  @event({ name: 'sl-a6-file-row-action' })
  rowActionEvent!: EventEmitter<SlA6FileRowActionEvent>;

  override render(): TemplateResult {
    const model = this.model,
      files = model?.files ?? [],
      selected = new Set(model?.selectedIds ?? []);

    return html`
      <table>
        <thead>
          <tr>
            ${COLUMNS.map(column => {
              const isSorted = column.sort && model?.sort?.field === column.sort;

              return html`
                <th
                  class=${column.key}
                  scope="col"
                  aria-sort=${isSorted
                    ? model?.sort?.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : nothing}>
                  <span class="label">${column.label}</span>
                  ${column.sort
                    ? html`
                        <button
                          @click=${() => this.#onSortClick(column.sort as FileSortField)}
                          aria-label=${`Sort by ${column.label}`}
                          class="sort"
                          type="button">
                          <sl-icon
                            name=${isSorted
                              ? model?.sort?.direction === 'asc'
                                ? 'sort-up'
                                : 'sort-down'
                              : 'sort'}></sl-icon>
                        </button>
                      `
                    : nothing}
                </th>
              `;
            })}
          </tr>
        </thead>
        <tbody>
          ${files.map(
            file => html`
              <tr>
                <td class="select">
                  <sl-checkbox
                    @sl-change=${(event: Event & { detail?: boolean }) =>
                      this.#onSelectToggle(file.id, event.detail === true)}
                    .checked=${selected.has(file.id)}
                    aria-label=${`Select ${file.title}`}></sl-checkbox>
                </td>
                <td class="title">
                  <!--
                    The file-type glyphs docx / xlsx / pptx are multi-colour brand marks. They are
                    not registered in this theme, and sl-icon paints a single
                    'var(--sl-icon-fill-default)', so it could not render them even if they were.
                    The 24px badge is kept empty and aria-hidden so the 8px gap and the title's
                    x-offset survive.
                  -->
                  <span aria-hidden="true" class="badge"></span>
                  <a href=${file.href}>${file.title}</a>
                </td>
                <td class="published">
                  ${DATE_FORMAT.format(new Date(file.publishedAt))}, ${file.publishedBy}
                </td>
                <td class="type">${KIND_LABEL[file.kind]}</td>
                <td class="actions">
                  <sl-button
                    @click=${() => this.#onRowAction(file.id)}
                    aria-label=${`Actions for ${file.title}`}
                    fill="ghost">
                    <sl-icon name="ellipsis" size="xl"></sl-icon>
                  </sl-button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  #onSortClick(field: FileSortField): void {
    const current = this.model?.sort;

    this.sortChangeEvent.emit({
      field,
      // Activating the already-sorted column flips it; any other column starts ascending.
      direction: current?.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    });
  }

  #onSelectToggle(fileId: string, checked: boolean): void {
    const current = this.model?.selectedIds ?? [],
      selectedIds = checked ? [...new Set([...current, fileId])] : current.filter(id => id !== fileId);

    this.selectionChangeEvent.emit({ selectedIds });
  }

  #onRowAction(fileId: string): void {
    this.rowActionEvent.emit({ fileId });
  }
}
