var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { msg } from '@lit/localize';
import { Checkbox } from '@sl-design-system/checkbox';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GridColumn } from './column.js';
export class GridSelectionColumn extends GridColumn {
  /** @internal */
  get baseScopedElements() {
    return { 'sl-checkbox': Checkbox };
  }
  connectedCallback() {
    super.connectedCallback();
    this.grow = 0;
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('grid') && this.grid) {
      this.grid.selects = 'multiple';
    }
    if (changes.has('grid') && this.grid?.dataSource) {
      this.grid.dataSource.selects = 'multiple';
    }
    if (changes.has('grid') && this.selectAll) {
      this.grid?.dataSource?.selectAll();
    }
  }
  renderHeaderRow(index) {
    if (index === 0) {
      const checked = !!this.grid?.dataSource?.selected && this.grid?.dataSource?.areAllSelected(),
        indeterminate = this.grid?.dataSource?.areSomeSelected(),
        classes = this.getClasses();
      return html`
        <th
          class=${ifDefined(classes.join(' ') || void 0)}
          part="header selection"
          role="columnheader">
          <sl-checkbox
            @sl-change=${({ detail }) => this.#onToggleAll(detail)}
            ?checked=${checked}
            ?indeterminate=${indeterminate}
            aria-label=${msg('Select all rows', { id: 'sl.grid.selectAllRows' })}
            class="selection-toggle"
            size="sm"></sl-checkbox>
        </th>
      `;
    } else {
      const classes = this.getClasses();
      return html`
        <th
          class=${ifDefined(classes.join(' ') || void 0)}
          part="header selection-placeholder"
          role="columnheader"></th>
      `;
    }
  }
  renderData(item) {
    const classes = this.getClasses(item.data);
    return html`
      <td
        @click=${this.#onClick}
        class=${ifDefined(classes.join(' ') || void 0)}
        part="data selection">
        <sl-checkbox
          @sl-change=${() => this.#onToggle(item)}
          ?checked=${item.selected}
          aria-label=${msg('Select row', { id: 'sl.grid.selectRow' })}
          class="selection-toggle"
          size="sm"></sl-checkbox>
      </td>
    `;
  }
  #onClick(event) {
    if (event.target instanceof HTMLTableCellElement) {
      event.preventDefault();
      event.stopPropagation();
      event.target.firstElementChild?.click();
    }
  }
  #onToggle(item) {
    this.selectAll = false;
    this.grid?.dataSource?.toggle(item);
    this.grid?.dataSource?.update();
  }
  #onToggleAll(checked) {
    this.selectAll = checked;
    if (this.selectAll) {
      this.grid?.dataSource?.selectAll();
    } else {
      this.grid?.dataSource?.deselectAll();
    }
    this.grid?.dataSource?.update();
  }
}
__decorateClass(
  [property({ type: Boolean, attribute: 'select-all' })],
  GridSelectionColumn.prototype,
  'selectAll',
  2
);
//# sourceMappingURL=selection-column.js.map
