import { msg } from '@lit/localize';
import { Icon } from '@sl-design-system/icon';
import { getValueByPath } from '@sl-design-system/shared';
import { html, nothing } from 'lit';
import { GridColumn } from './column.js';
export class GridDragHandleColumn extends GridColumn {
  /** @internal */
  get baseScopedElements() {
    return { 'sl-icon': Icon };
  }
  connectedCallback() {
    super.connectedCallback();
    this.grow = 0;
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('grid') && this.grid) {
      this.grid.draggableRows ??= 'between';
    }
  }
  renderHeaderRow() {
    return html`
      <th part="header drag-handle" role="columnheader">
        <span class="visually-hidden">${msg('Reorder', { id: 'sl.grid.reorder' })}</span>
      </th>
    `;
  }
  renderData(item) {
    let draggable = true;
    if (this.path) {
      draggable = !!getValueByPath(item.data, this.path);
    }
    return html`
      <td
        @mousedown=${event => this.#onStartDrag(event, item.data)}
        @touchstart=${event => this.#onStartDrag(event, item.data)}
        part="data drag-handle ${draggable ? '' : 'fixed'}">
        ${draggable ? html`<sl-icon name="grip-lines"></sl-icon>` : nothing}
      </td>
    `;
  }
  #onStartDrag(event, item) {
    if (!this.path || getValueByPath(item, this.path)) {
      event.target.closest('tr')?.setAttribute('draggable', 'true');
    }
  }
}
//# sourceMappingURL=drag-handle-column.js.map
