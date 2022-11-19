import type { CSSResultGroup, TemplateResult } from 'lit';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './grid.scss.js';
import { GridColumn } from './column.js';

export class Grid<T extends { [x: string]: unknown } = Record<string, unknown>> extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The columns in the grid. */
  @state() columns: Array<GridColumn<T>> = [];

  /** An array of items to be displayed in the grid. */
  @property() items: T[] = [];

  /** Hide the border around the grid when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder?: boolean;

  /** Hides the border between rows when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-row-border' }) noRowBorder?: boolean;

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange} style="display:none"></slot>
      <style>
        ${this.columns.map((col, index) => {
          return `
            td:nth-child(${index + 1}) {
              flex-grow: ${col.grow};
              width: ${col.width};
            }
          `;
        })}
      </style>
      <table>
        <thead>
          <tr>
            ${this.columns.map(col => col.renderHeader())}
          </tr>
        </thead>
        <tbody>
          ${virtualize({ items: this.items, renderItem: item => this.renderItem(item) })}
        </tbody>
        <tfoot></tfoot>
      </table>
    `;
  }

  renderItem(item: T): TemplateResult {
    return html`
      <tr>
        ${this.columns.map(col => col.renderData(item))}
      </tr>
    `;
  }

  recalculateColumnWidths(): void {
    console.log('TODO: recalculateColumnWidths');
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true });

    this.columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);
  }
}
