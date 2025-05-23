import { type DataSourceSortDirection, type DataSourceSortFunction } from '@sl-design-system/data-source';
import { getNameByPath } from '@sl-design-system/shared';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type Ref, createRef, ref } from 'lit/directives/ref.js';
import { GridColumn } from './column.js';
import { GridSorter } from './sorter.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-sort-column': GridSortColumn;
  }
}

let nextUniqueId = 0;

/**
 * A grid column that can be sorted.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSortColumn<T = any> extends GridColumn<T> {
  /** Reference to the rendered `<sl-grid-sorter>` element. */
  #sorterRef: Ref<GridSorter> = createRef();

  /** @internal The direction of the sorting */
  @property({ attribute: false }) ariaSorting?: 'ascending' | 'descending';

  /** The direction this columns should be sorted in. */
  @property() direction?: DataSourceSortDirection;

  /** If you want to provide a custom sort function, you can via this property. */
  @property({ attribute: false }) sorter?: DataSourceSortFunction<T>;

  /** Returns the element that is rendered in the table header. */
  get sorterElement(): GridSorter | undefined {
    return this.#sorterRef.value;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `grid-sort-${nextUniqueId++}`;
    this.scopedElements = { ...this.scopedElements, 'sl-grid-sorter': GridSorter };
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('direction') && this.#sorterRef.value) {
      this.#sorterRef.value.direction = this.direction;
    }
  }

  override stateChanged(): void {
    super.stateChanged();

    this.direction = undefined;

    const sort = this.grid?.dataSource?.sort;
    if (sort && (sort?.by === this.path || sort?.by === this.sorter)) {
      this.direction = sort?.direction;
    }

    if (!this.direction) {
      this.ariaSorting = undefined;
    } else {
      this.ariaSorting = this.direction === 'asc' ? 'ascending' : 'descending';
    }
  }

  override renderHeaderRow(index: number): TemplateResult | typeof nothing {
    if (index >= this.headerRowCount) {
      return nothing;
    }

    const parts = ['header', 'sort', ...this.getParts()];

    return html`
      <th aria-sort=${ifDefined(this.ariaSorting)} part=${parts.join(' ')} role="columnheader" scope="col">
        <sl-grid-sorter
          ${ref(this.#sorterRef)}
          .column=${this}
          .direction=${this.direction}
          .path=${this.path}
          .sorter=${this.sorter}
        >
          ${this.header ?? getNameByPath(this.path)}
        </sl-grid-sorter>
      </th>
    `;
  }
}
