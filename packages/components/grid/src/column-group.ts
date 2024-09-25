import { type PropertyValues, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-column-group': GridColumnGroup;
  }
}

export class GridColumnGroup<T = unknown> extends GridColumn<T> {
  #width?: number;

  /** The nested columns in the group. */
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

  override renderHeader(): TemplateResult {
    return html`<th colspan=${Math.max(this.columns.length, 1)}>${this.header}</th>`;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);

    columns.forEach(col => (col.grid = this.grid));

    this.columns = columns;
    this.scopedElements = columns.reduce((acc, cur) => {
      return { ...acc, ...cur.scopedElements };
    }, {});

    // Notify the grid that the column definition has changed
    this.columnUpdateEvent.emit({ grid: this.grid!, column: this });
  }
}
