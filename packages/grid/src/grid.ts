import type { CSSResultGroup, TemplateResult } from 'lit';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './grid.scss.js';
import { GridColumn } from './column.js';

export class Grid<T extends { [x: string]: unknown } = Record<string, unknown>> extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Flag for calculating the column widths only once. */
  #initialColumnWidthsCalculated = false;

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
            :where(td, th):nth-child(${index + 1}) {
              flex-grow: ${col.grow};
              width: ${col.width || '100'}px;
              ${
                col.sticky
                  ? `
                    left: ${this.#getStickyColumnOffset(index)}px;
                    position: sticky;
                  `
                  : ''
              }
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
        <tbody @visibilityChanged=${this.#onVisibilityChanged}>
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

  /** Updates the `width` of all columns which have `autoWidth` set to `true`. */
  async recalculateColumnWidths(): Promise<void> {
    // Do not remove, this is needed; not sure why
    await this.updateComplete;

    this.columns
      .filter(col => !col.hidden && col.autoWidth)
      .forEach(col => {
        const index = this.columns.indexOf(col),
          cells = this.renderRoot.querySelectorAll<HTMLElement>(`:where(td, th):nth-child(${index + 1})`);

        col.width = Array.from(cells).reduce((acc, cur) => {
          cur.style.flexGrow = '0';
          cur.style.width = 'auto';

          const { width } = cur.getBoundingClientRect();

          cur.style.flexGrow = cur.style.width = '';

          return Math.max(acc, width);
        }, 0);
      });

    this.requestUpdate('columns');
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true });

    this.columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);
  }

  #onVisibilityChanged(): void {
    if (!this.#initialColumnWidthsCalculated) {
      this.#initialColumnWidthsCalculated = true;

      void this.recalculateColumnWidths();
    }
  }

  #getStickyColumnOffset(index: number): number {
    return this.columns
      .slice(0, index)
      .filter(col => !col.hidden)
      .reduce((acc, { width = 0 }) => {
        return acc + width;
      }, 0);
  }
}
