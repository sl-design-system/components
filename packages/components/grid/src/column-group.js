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
import { html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { GridColumn } from './column.js';
export class GridColumnGroup extends GridColumn {
  constructor() {
    super(...arguments);
    this.columns = [];
  }
  #width;
  set width(value) {
    this.#width = value;
  }
  /** The width of the group column is either manually specified, or the sum of the nested columns. */
  get width() {
    return this.#width ?? this.columns.reduce((acc, cur) => acc + (cur.width || 100), 0);
  }
  willUpdate(changes) {
    if (changes.has('grid')) {
      this.columns.forEach(col => (col.grid = this.grid));
    }
  }
  render() {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }
  renderHeaderRow(index) {
    if (index >= this.headerRowCount) {
      return nothing;
    }
    return html`<th colspan=${Math.max(this.columns.length, 1)}>${this.renderHeaderLabel()}</th>`;
  }
  #onSlotchange(event) {
    const elements = event.target.assignedElements({ flatten: true }),
      columns = elements.filter(el => el instanceof GridColumn);
    columns.forEach(col => (col.grid = this.grid));
    this.columns = columns;
    this.scopedElements = columns.reduce((acc, cur) => {
      return { ...acc, ...cur.scopedElements };
    }, {});
    this.columnUpdateEvent.emit({ grid: this.grid, column: this });
  }
}
__decorateClass([state()], GridColumnGroup.prototype, 'columns', 2);
//# sourceMappingURL=column-group.js.map
