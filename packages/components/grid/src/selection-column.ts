import type { CSSResult, PropertyValues, TemplateResult } from 'lit';
import type { GridActiveItemChangeEvent } from './grid.js';
import { localized, msg, str } from '@lit/localize';
import { Checkbox } from '@sl-design-system/checkbox';
import { EventsController } from '@sl-design-system/shared';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';

@localized()
export class GridSelectionColumn<T extends Record<string, unknown> = Record<string, unknown>> extends GridColumn {
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

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('grid') && this.grid) {
      this.#events.listen(this.grid, 'sl-active-item-change', this.#onActiveItemChange);

      this.grid.selection.multiple = true;

      if (this.selectAll) {
        this.grid.selection.selectAll();
      }
    }
  }

  override renderHeader(): TemplateResult {
    const checked = this.grid?.selection.areAllSelected(),
      indeterminate = this.grid?.selection.areSomeSelected();

    return html`
      <th part="header selection">
        <sl-checkbox
          @sl-change=${({ detail }: CustomEvent<boolean>) => this.#onToggleSelectAll(detail)}
          ?checked=${checked}
          ?indeterminate=${indeterminate}
          aria-label=${msg('Select all')}
        ></sl-checkbox>
      </th>
    `;
  }

  renderSelectionHeader(): TemplateResult {
    const count = this.grid?.selection.areAllSelected()
      ? this.grid?.selection.size
      : this.grid?.selection.selection.size;

    return html`
      <th part="header active-selection">
        <span class="selection-count">${msg(str`${count} selected`)}</span>
        <slot name="selection-header"></slot>
      </th>
    `;
  }

  override renderData(item: T): TemplateResult {
    const checked = this.grid?.selection.isSelected(item);

    return html`
      <td>
        <sl-checkbox
          @sl-change=${({ detail }: CustomEvent<boolean>) => this.#onToggleSelect(item, detail)}
          ?checked=${checked}
        ></sl-checkbox>
      </td>
    `;
  }

  override renderStyles(): CSSResult {
    return css`
      inline-size: calc(2 * var(--sl-space-input-inline-md) + var(--sl-size-input-md) + 1rem);
      padding-block: 0;
      padding-inline: 0.5rem;
    `;
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
