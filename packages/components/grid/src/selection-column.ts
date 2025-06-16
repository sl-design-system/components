import { msg } from '@lit/localize';
import { Checkbox } from '@sl-design-system/checkbox';
import { type ListDataSourceDataItem, type ListDataSourceItem } from '@sl-design-system/data-source';
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
  /** Set this property to true to select all rows in the grid. */
  @property({ type: Boolean, attribute: 'select-all' }) selectAll?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.grow = 0;
    this.scopedElements = { 'sl-checkbox': Checkbox };
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('grid') && this.grid?.dataSource) {
      this.grid.dataSource.selects = 'multiple';
    }

    if (changes.has('grid') && this.selectAll) {
      this.grid?.dataSource?.selectAll();
    }
  }

  override renderHeaderRow(index: number): TemplateResult | typeof nothing {
    if (index === 0) {
      const checked = !!this.grid?.dataSource?.selected && this.grid?.dataSource?.areAllSelected(),
        indeterminate = this.grid?.dataSource?.areSomeSelected();

      return html`
        <th part="header selection" role="columnheader">
          <sl-checkbox
            @sl-change=${({ detail }: SlChangeEvent<boolean>) => this.#onToggleAll(detail)}
            ?checked=${checked}
            ?indeterminate=${indeterminate}
            aria-label=${msg('Select all rows', { id: 'sl.grid.selectAllRows' })}
            class="selection-toggle"
            size="sm"
          ></sl-checkbox>
        </th>
      `;
    } else {
      return html`<th part="header selection-placeholder" role="columnheader"></th>`;
    }
  }

  override renderData(item: ListDataSourceDataItem<T>): TemplateResult {
    return html`
      <td @click=${this.#onClick} part="data selection">
        <sl-checkbox
          @sl-change=${() => this.#onToggle(item)}
          ?checked=${item.selected}
          aria-label=${msg('Select row', { id: 'sl.grid.selectRow' })}
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
      event.preventDefault();
      event.stopPropagation();

      (event.target.firstElementChild as HTMLElement)?.click();
    }
  }

  #onToggle(item: ListDataSourceItem<T>): void {
    this.selectAll = false;

    this.grid?.dataSource?.toggle(item);
    this.grid?.dataSource?.update();
  }

  #onToggleAll(checked: boolean): void {
    this.selectAll = checked;

    if (this.selectAll) {
      this.grid?.dataSource?.selectAll();
    } else {
      this.grid?.dataSource?.deselectAll();
    }

    this.grid?.dataSource?.update();
  }
}
