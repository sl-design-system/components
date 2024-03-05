import { msg, str } from '@lit/localize';
import { Checkbox } from '@sl-design-system/checkbox';
import { EventsController } from '@sl-design-system/shared';
import { type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';
import { type GridActiveItemChangeEvent } from './events.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSelectionColumn<T = any> extends GridColumn<T> {
  #events = new EventsController(this);

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
      this.#events.listen(this.grid, 'sl-active-item-change', this.#onActiveItemChange);

      this.grid.selection.multiple = true;

      if (this.selectAll) {
        this.grid.selection.selectAll();
      }
    }
  }

  override renderHeader(): TemplateResult {
    const checked = !!this.grid?.selection.size && this.grid?.selection.areAllSelected(),
      indeterminate = this.grid?.selection.areSomeSelected();

    return html`
      <th part="header selection">
        <sl-checkbox
          @sl-change=${({ detail }: CustomEvent<boolean>) => this.#onToggleSelectAll(detail)}
          .checked=${checked}
          .indeterminate=${indeterminate}
          aria-label=${msg('Select all')}
          class="selection-toggle"
          size="sm"
        ></sl-checkbox>
      </th>
    `;
  }

  renderSelectionHeader(): TemplateResult {
    return html`
      <th part="header active-selection">
        <span class="selection-count">${msg(str`${this.getSelectedCount()} selected`)}</span>
        <slot name="selection-header"></slot>
      </th>
    `;
  }

  override renderData(item: T): TemplateResult {
    const checked = this.grid?.selection.isSelected(item);

    return html`
      <td part="data selection">
        <sl-checkbox
          @sl-change=${({ detail }: CustomEvent<boolean>) => this.#onToggleSelect(item, detail)}
          .checked=${checked}
          class="selection-toggle"
          size="sm"
        ></sl-checkbox>
      </td>
    `;
  }

  getSelectedCount(): number {
    const { selection } = this.grid!,
      size = this.grid?.dataSource?.filteredItems.length ?? 0;

    let result = 0;
    if (selection.areAllSelected()) {
      result = size;
    } else if (selection.isSelectAllToggled()) {
      result = size - selection.selection.size;
    } else {
      result = selection.selection.size;
    }

    return result;
  }

  #onActiveItemChange({ item, relatedEvent }: GridActiveItemChangeEvent<T>): void {
    const isCheckbox = (relatedEvent?.target as HTMLElement)?.tagName.toLowerCase() === 'sl-checkbox';

    if (!this.autoSelect || !item || isCheckbox) {
      return;
    }

    this.selectAll = false;
    this.grid?.selection.toggle(item);
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
