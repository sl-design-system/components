import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { A10UserTableFooter, type TablePageModel } from './table-footer/table-footer.js';
import styles from './user-table.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a10-sort-change': SlA10SortChangeEvent;
    'sl-a10-user-delete': SlA10UserDeleteEvent;
    'sl-a10-user-edit': SlA10UserEditEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a10-user-table': A10UserTable;
  }
}

/** One row of the FAM user list. Domain data and stable keys only — no UI strings. */
export interface FamUser {
  id: string;
  login: string;
  name: string;
  email: string;
  /** Free text the data source owns, so it is data rather than a key. */
  role: string;
  employeeType: string;
  cfa: string;
  /** ISO 8601, e.g. '2024-10-23T14:30:00'. Formatted for display by this component. */
  lastLoginAt: string;
}

export type FamUserColumnId = 'login' | 'name' | 'email' | 'role' | 'employeeType' | 'cfa' | 'lastLoginAt';

export interface FamUserSort {
  column: FamUserColumnId;
  direction: 'asc' | 'desc';
}

export interface UserTableModel {
  /** Already filtered, sorted and paged by the data owner. */
  rows: FamUser[];
  sort: FamUserSort;
  page: TablePageModel;
}

export type SlA10SortChangeEvent = CustomEvent<FamUserSort>;
export type SlA10UserEditEvent = CustomEvent<{ userId: string }>;
export type SlA10UserDeleteEvent = CustomEvent<{ userId: string }>;

/**
 * Structural config, not data: the parent says WHICH user has which value, this component knows
 * WHAT the columns are. Widths are the design's own fractional measurements and sum to exactly
 * 1200: 6 x 155.8333 + 117 + 148 = 935.0 + 265 = 1200.
 */
const USER_TABLE_COLUMNS = [
  { id: 'login', label: 'Login', width: 155.8333, sortable: true },
  { id: 'name', label: 'Name', width: 155.8333, sortable: true },
  { id: 'email', label: 'Email', width: 155.8333, sortable: true },
  { id: 'role', label: 'Role', width: 155.8333, sortable: true },
  { id: 'employeeType', label: 'Employee type', width: 155.8333, sortable: true },
  { id: 'cfa', label: 'CFA', width: 117, sortable: true },
  { id: 'lastLoginAt', label: 'Last login date', width: 155.8333, sortable: true },
  { id: 'actions', label: '', width: 148, sortable: false }
] as const satisfies ReadonlyArray<{
  id: FamUserColumnId | 'actions';
  label: string;
  width: number;
  sortable: boolean;
}>;

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * '2024-10-23T14:30:00' -> '23-10-2024 at 14:30'.
 *
 * Built from the date parts deliberately: `toLocaleString('en-GB')` yields slashes, not the
 * design's hyphens, and would silently drift with the host's locale.
 */
const formatLastLogin = (iso: string): string => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} at ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * The FAM user list: an as-is port of the design's Vuetify data table (`mat-body`,
 * `th-text-start`, `td-text-start`), not a mapping onto `sl-grid`. See OQ-1 — there is no
 * `sl-table` in this repository, and `sl-grid` brings a column model, header chrome and sort
 * affordance that would all have to be fought to reach these fractional widths and row heights.
 *
 * Presentational: it renders the slice the root hands it and emits intent. It does not filter,
 * sort or page — the root owns all of that.
 *
 * Registered through the root's `scopedElements`; it never calls `customElements.define`.
 */
export class A10UserTable extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-a10-user-table-footer': A10UserTableFooter,
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a sortable column header is activated. */
  @event({ name: 'sl-a10-sort-change' }) sortChangeEvent!: EventEmitter<SlA10SortChangeEvent>;

  /** @internal Emits when a row's Edit action is activated. */
  @event({ name: 'sl-a10-user-edit' }) userEditEvent!: EventEmitter<SlA10UserEditEvent>;

  /** @internal Emits when a row's Delete action is activated. */
  @event({ name: 'sl-a10-user-delete' }) userDeleteEvent!: EventEmitter<SlA10UserDeleteEvent>;

  /** The rows to render, the current sort, and the paging state passed through to the footer. */
  @property({ attribute: false }) model!: UserTableModel;

  override render(): TemplateResult {
    const rows = this.model?.rows ?? [],
      sort = this.model?.sort;

    return html`
      <table>
        <caption>Functional management users</caption>
        <colgroup>
          ${USER_TABLE_COLUMNS.map(column => html`<col style=${`width:${column.width}px`} />`)}
        </colgroup>
        <thead>
          <tr>
            ${USER_TABLE_COLUMNS.map(column => this.renderHeaderCell(column, sort))}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => this.renderRow(row))}
        </tbody>
      </table>
      <sl-a10-user-table-footer .model=${this.model?.page}></sl-a10-user-table-footer>
    `;
  }

  private renderHeaderCell(
    column: (typeof USER_TABLE_COLUMNS)[number],
    sort: FamUserSort | undefined
  ): TemplateResult {
    if (column.id === 'actions') {
      return html`<th scope="col"><span class="sr-only">Actions</span></th>`;
    }

    const sorted = sort?.column === column.id,
      ariaSort = sorted ? (sort?.direction === 'asc' ? 'ascending' : 'descending') : undefined;

    return html`
      <th scope="col" aria-sort=${ariaSort ?? nothing}>
        <button type="button" @click=${() => this.onSort(column.id as FamUserColumnId, sort)}>
          <span>${column.label}</span>
          <!-- Unsorted columns render no glyph at all: the design shows none, and emitting a
               neutral sort-both marker on the other six would add six marks the reference does
               not have. The sort-up glyph substitutes the design's arrow-up, which
               editorial-suite does not register (it has arrow-left, arrow-right and
               arrow-up-right-from-square only). The silhouette differs - filled triangle vs
               line arrow - and that is recorded as a Stage 4 discrepancy.
               NB: no backticks in this comment - a backtick inside an HTML comment terminates
               the enclosing tagged template literal. -->
          ${sorted ? html`<sl-icon name="sort-up" size="xs"></sl-icon>` : nothing}
        </button>
      </th>
    `;
  }

  private renderRow(row: FamUser): TemplateResult {
    return html`
      <tr>
        <td>${row.login}</td>
        <td>${row.name}</td>
        <td>${row.email}</td>
        <td>${row.role}</td>
        <td>${row.employeeType}</td>
        <td>${row.cfa}</td>
        <td>${formatLastLogin(row.lastLoginAt)}</td>
        <td class="actions">
          <sl-button
            fill="link"
            size="sm"
            aria-label=${`Edit ${row.login}`}
            @click=${() => this.userEditEvent.emit({ userId: row.id })}
            >Edit</sl-button
          >
          <sl-button
            fill="link"
            size="sm"
            aria-label=${`Delete ${row.login}`}
            @click=${() => this.userDeleteEvent.emit({ userId: row.id })}
            >Delete</sl-button
          >
        </td>
      </tr>
    `;
  }

  private onSort(column: FamUserColumnId, sort: FamUserSort | undefined): void {
    const direction = sort?.column === column && sort.direction === 'asc' ? 'desc' : 'asc';

    this.sortChangeEvent.emit({ column, direction });
  }
}
