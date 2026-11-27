import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-column-group': GridColumnGroup;
  }
}

/**
 * Groups nested columns under a shared header.
 *
 * @omit path - Not applicable to a column group, it does not render cells.
 * @omit renderer - Not applicable to a column group, it does not render cells.
 * @omit parts - Not applicable to a column group, it does not render cells.
 * @omit ellipsizeText - Not applicable to a column group, it does not render cells.
 * @omit autoWidth - Not applicable to a column group, it does not render cells.
 * @omit grow - Not applicable to a column group, it does not render cells.
 * @omit sticky - Not applicable to a column group, it does not render cells.
 * @omit formControlColumnLabel - Not applicable to a column group, it does not render cells.
 * @omit formControlLabel - Not applicable to a column group, it does not render cells.
 * @omit scopedElements - Not applicable to a column group, it does not render cells.
 * @omit-method getClasses - Not applicable to a column group, it does not render cells.
 * @omit-method getDisplayValue - Not applicable to a column group, it does not render cells.
 * @omit-method getFormControlLabel - Not applicable to a column group, it does not render cells.
 * @omit-method getParts - Not applicable to a column group, it does not render cells.
 * @omit-method itemsChanged - Not applicable to a column group, it does not render cells.
 * @omit-method stateChanged - Not applicable to a column group, it does not render cells.
 * @omit-method renderData - Not applicable to a column group, it does not render cells.
 * @omit-method renderHeaderLabel - Not applicable to a column group, it does not render cells.
 * @omit-method renderHeaderRow - Internal rendering of the group header, not meant to be overridden.
 * @omit-method renderStyles - Not applicable to a column group, it does not render cells.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridColumnGroup<T = any> extends GridColumn<T> {
  #width?: number;

  /**
   * The nested columns in the group.
   *
   * @ignore
   */
  @state() columns: Array<GridColumn<T>> = [];

  override set width(value: number) {
    this.#width = value;
  }

  /** The width of the group column is either manually specified, or the sum of the nested columns. */
  override get width(): number {
    return this.#width ?? this.columns.reduce((acc, cur) => acc + (cur.width || 100), 0);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('grid')) {
      this.columns.forEach(col => (col.grid = this.grid));
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    // The labels of the group are copied to the nested columns by the grid. Tell the grid when
    // they change, so it can refresh them.
    if (
      this.grid &&
      (changes.has('header') ||
        changes.has('formControlColumnLabel') ||
        changes.has('hideHeaderText'))
    ) {
      this.columnUpdateEvent.emit({ grid: this.grid, column: this });
    }
  }

  override renderHeaderRow(index: number): TemplateResult | typeof nothing {
    if (index >= this.headerRowCount) {
      return nothing;
    }

    return html`
      <th
        aria-colindex=${String(this.columnIndex)}
        aria-colspan=${Math.max(this.columnSpan, 1)}
        aria-label=${ifDefined(this.headerAriaLabel)}
        colspan=${Math.max(this.columnSpan, 1)}
        id=${this.headerCellId}
        role="cell">
        ${this.renderHeaderLabel()}
      </th>
    `;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);

    // The grid recalculates `groupHeaderIds` when it receives the column update event
    columns.forEach(col => (col.grid = this.grid));

    this.columns = columns;
    this.scopedElements = columns.reduce((acc, cur) => {
      return { ...acc, ...cur.scopedElements };
    }, {});

    // Notify the grid that the column definition has changed
    this.columnUpdateEvent.emit({ grid: this.grid!, column: this });
  }
}
