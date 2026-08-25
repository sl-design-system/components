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
import { getNameByPath } from '@sl-design-system/shared';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { GridColumn } from './column.js';
import { GridSorter } from './sorter.js';
let nextUniqueId = 0;
export class GridSortColumn extends GridColumn {
  /** Reference to the rendered `<sl-grid-sorter>` element. */
  #sorterRef = createRef();
  /** @internal */
  get baseScopedElements() {
    return { 'sl-grid-sorter': GridSorter };
  }
  /** Returns the element that is rendered in the table header. */
  get sorterElement() {
    return this.#sorterRef.value;
  }
  connectedCallback() {
    super.connectedCallback();
    this.id ||= `grid-sort-${nextUniqueId++}`;
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('direction') && this.#sorterRef.value) {
      this.#sorterRef.value.direction = this.direction;
    }
  }
  stateChanged() {
    super.stateChanged();
    this.direction = void 0;
    const sort = this.grid?.dataSource?.sort;
    if (sort && (sort?.by === this.path || sort?.by === this.sorter)) {
      this.direction = sort?.direction;
    }
    if (!this.direction) {
      this.ariaSorting = void 0;
    } else {
      this.ariaSorting = this.direction === 'asc' ? 'ascending' : 'descending';
    }
  }
  renderHeaderRow(index) {
    if (index >= this.headerRowCount) {
      return nothing;
    }
    const parts = ['header', 'sort', ...this.getParts()];
    return html`
      <th
        aria-sort=${ifDefined(this.ariaSorting)}
        part=${parts.join(' ')}
        role="columnheader"
        scope="col">
        <sl-grid-sorter
          ${ref(this.#sorterRef)}
          .column=${this}
          .direction=${this.direction}
          .path=${this.path}
          .sorter=${this.sorter}>
          ${this.header ?? getNameByPath(this.path)}
        </sl-grid-sorter>
      </th>
    `;
  }
}
__decorateClass([property({ attribute: false })], GridSortColumn.prototype, 'ariaSorting', 2);
__decorateClass([property()], GridSortColumn.prototype, 'direction', 2);
__decorateClass([property({ attribute: false })], GridSortColumn.prototype, 'sorter', 2);
//# sourceMappingURL=sort-column.js.map
