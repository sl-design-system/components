import type { GridFilterValueChangeEvent } from './src/filter-column.js';
import type { GridActiveItemChangeEvent, GridEvent } from './src/grid.js';
import type { GridSortDirectionChangeEvent } from './src/sort-column.js';
import { Grid } from './src/grid.js';
import { GridColumn } from './src/column.js';
import { GridColumnGroup } from './src/column-group.js';
import { GridSelectionColumn } from './src/selection-column.js';
import { GridSortColumn } from './src/sort-column.js';
import { GridFilterColumn } from './src/filter-column.js';

customElements.define('sl-grid', Grid);
customElements.define('sl-grid-column', GridColumn);
customElements.define('sl-grid-column-group', GridColumnGroup);
customElements.define('sl-grid-filter-column', GridFilterColumn);
customElements.define('sl-grid-selection-column', GridSelectionColumn);
customElements.define('sl-grid-sort-column', GridSortColumn);

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-active-item-change': GridActiveItemChangeEvent;
    'sl-filter-value-change': GridFilterValueChangeEvent;
    'sl-grid-items-change': GridEvent;
    'sl-sort-direction-change': GridSortDirectionChangeEvent;
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
