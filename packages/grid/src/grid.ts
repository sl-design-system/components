import type { CSSResultGroup, TemplateResult } from 'lit';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './grid.scss.js';
import { GridColumn } from './column.js';

export class Grid<T extends { [x: string]: unknown } = Record<string, unknown>> extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @state() columns: Array<GridColumn<T>> = [];

  @property() items: T[] = [];

  render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange} style="display:none"></slot>
      <table>
        <thead></thead>
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
        ${this.columns.map(col => col.renderContentCell(item))}
      </tr>
    `;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true });

    this.columns = elements.filter((el): el is GridColumn<T> => el instanceof GridColumn);
  }
}
