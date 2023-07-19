import type { PropertyValues, TemplateResult } from 'lit';
import { getNameByPath } from '@sl-design-system/shared';
import { html } from 'lit';
import { state } from 'lit/decorators.js';
import { GridColumn } from './column.js';
import { GridColumnEvent } from './events.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridColumnGroup<T = any> extends GridColumn<T> {
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
    return html`<th colspan=${this.columns.length}>${this.header ?? getNameByPath(this.path)}</th>`;
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
    this.columnUpdate.emit(new GridColumnEvent('sl-column-update', this));
  }
}
