import { msg } from '@lit/localize';
import { Checkbox } from '@sl-design-system/checkbox';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-selection-column': GridSelectionColumn;
  }
}

/**
 * A grid column that can be used to select items in the grid.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSelectionColumn<T = any> extends GridColumn<T> {
  /** When true, the active rows get selected automatically. */
  @property({ type: Boolean, attribute: 'auto-select' }) autoSelect?: boolean;

  /** When true, all items are selected. */
  @property({ type: Boolean, attribute: 'select-all' }) selectAll?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.grow = 0;
    this.scopedElements = { 'sl-checkbox': Checkbox };
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('grid') && this.grid) {
      this.grid.selection.multiple = true;

      if (this.selectAll) {
        this.grid.selection.selectAll();
      }
    }
  }

  override renderHeaderRow(index: number): TemplateResult | typeof nothing {
    if (index === 0) {
      const checked = !!this.grid?.selection.size && this.grid?.selection.areAllSelected(),
        indeterminate = this.grid?.selection.areSomeSelected();

      return html`
        <th part="header selection" role="columnheader">
          <sl-checkbox
            @sl-change=${({ detail }: SlChangeEvent<boolean>) => this.#onToggleSelectAll(detail)}
            .checked=${checked}
            .indeterminate=${indeterminate}
            aria-label=${msg('Select all rows', { id: 'sl.gridSelectionColumn.selectAllRowsChecboxLabel' })}
            class="selection-toggle"
            size="sm"
          ></sl-checkbox>
        </th>
      `;
    } else {
      return html`<th part="header selection-placeholder" role="columnheader"></th>`;
    }
  }

  override renderData(item: T): TemplateResult {
    const checked = this.grid?.selection.isSelected(item);

    return html`
      <td @click=${this.#onClick} part="data selection">
        <sl-checkbox
          @sl-change=${({ detail }: SlChangeEvent<boolean>) => this.#onToggleSelect(item, detail)}
          .checked=${checked}
          aria-label=${msg('Select row')}
          class="selection-toggle"
          size="sm"
        ></sl-checkbox>
      </td>
    `;
  }

  #onClick(event: Event & { target: HTMLElement }): void {
    // If the user clicks in the cell with the checkbox, but not on the checkbox itself,
    // we want to toggle the checkbox anyway. This is helpful for touch devices.
    if (event.target instanceof HTMLTableCellElement) {
      (event.target.firstElementChild as HTMLElement)?.click();
    }
  }

  #onToggleSelect(item: T, checked: boolean): void {
    this.selectAll = false;

    if (checked) {
      this.grid?.selection.select(item);
    } else {
      this.grid?.selection.deselect(item);
    }
  }

  #onToggleSelectAll(checked: boolean): void {
    this.selectAll = checked;

    if (this.selectAll) {
      this.grid?.selection.selectAll();
    } else {
      this.grid?.selection.deselectAll();
    }
  }
}
