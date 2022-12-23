import type { PropertyValues, TemplateResult } from 'lit';
import type { GridActiveItemChangeEvent } from './grid.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Checkbox } from '@sanomalearning/slds-core/checkbox';
import { EventsController } from '@sanomalearning/slds-core/utils/controllers';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { GridColumn } from './column.js';

@localized()
export class GridSelectionColumn<
  T extends { [x: string]: unknown } = Record<string, unknown>
> extends ScopedElementsMixin(GridColumn) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-checkbox': Checkbox
    };
  }

  #events = new EventsController(this);

  /** When true, the active rows get selected automatically. */
  @property({ type: Boolean, attribute: 'auto-select' }) autoSelect?: boolean;

  /** When true, all items are selected. */
  @property({ type: Boolean, attribute: 'select-all' }) selectAll?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.grow = 0;
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
      <th>
        <sl-checkbox
          @sl-change=${({ detail }: CustomEvent<boolean>) => this.#onToggleSelectAll(detail)}
          ?checked=${checked}
          ?indeterminate=${indeterminate}
          aria-label=${msg('Select all')}
        ></sl-checkbox>
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

  #onActiveItemChange({ item, originalTarget }: GridActiveItemChangeEvent<T>): void {
    const isCheckbox = (originalTarget as HTMLElement)?.tagName.toLowerCase() === 'sl-checkbox';

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
