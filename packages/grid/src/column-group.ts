import type { PropertyValues, TemplateResult } from 'lit';
import { getNameByPath } from '@sanomalearning/slds-core/utils';
import { html } from 'lit';
import { state } from 'lit/decorators.js';
import { GridColumn } from './column.js';

export class GridColumnGroup<T extends { [x: string]: unknown } = Record<string, unknown>> extends GridColumn<T> {
  #width?: number;

  @state() columns: Array<GridColumn<T>> = [];

  override set width(value: number) {
    this.#width = value;
  }

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
  }
}
