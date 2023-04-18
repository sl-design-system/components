import type { GridFilterValueChangeEvent } from './src/filter.js';
import type { GridActiveItemChangeEvent } from './src/grid.js';
import { Grid } from './src/grid.js';
import { GridColumn } from './src/column.js';
import { GridColumnGroup } from './src/column-group.js';
import { GridSelectionColumn } from './src/selection-column.js';
import { GridSortColumn } from './src/sort-column.js';
import { GridFilterColumn } from './src/filter-column.js';
declare global {
    interface GlobalEventHandlersEventMap {
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
