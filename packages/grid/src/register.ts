import type { GridFilterValueChangeEvent } from './filter.js';
import type { GridActiveItemChangeEvent } from './grid.js';
import { Grid } from './grid.js';
import { GridColumn } from './column.js';
import { GridColumnGroup } from './column-group.js';
import { GridSelectionColumn } from './selection-column.js';
import { GridSortColumn } from './sort-column.js';
import { GridFilterColumn } from './filter-column.js';

customElements.define('sl-grid', Grid);
customElements.define('sl-grid-column', GridColumn);
customElements.define('sl-grid-column-group', GridColumnGroup);
customElements.define('sl-grid-filter-column', GridFilterColumn);
customElements.define('sl-grid-selection-column', GridSelectionColumn);
customElements.define('sl-grid-sort-column', GridSortColumn);

declare global {
  interface GlobalEventHandlersEventMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'sl-active-item-change': GridActiveItemChangeEvent<any>;
    'sl-filter-change': GridFilterValueChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-grid': Grid;
    'sl-grid-column': GridColumn;
    'sl-grid-column-group': GridColumnGroup;
    'sl-grid-filter-column': GridFilterColumn;
    'sl-grid-selection-column': GridSelectionColumn;
    'sl-grid-sort-column': GridSortColumn;
  }
}
