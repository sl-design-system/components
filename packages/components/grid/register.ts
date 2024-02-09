/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  GridActiveItemChangeEvent,
  GridEvent,
  GridFilterValueChangeEvent,
  GridItemEvent,
  GridSortDirectionChangeEvent
} from './src/events.js';
import { Grid } from './src/grid.js';
import { GridColumn } from './src/column.js';
import { GridColumnGroup } from './src/column-group.js';
import { GridDragHandleColumn } from './src/drag-handle-column.js';
import { GridFilterColumn } from './src/filter-column.js';
import { GridSelectColumn } from './src/select-column.js';
import { GridSelectionColumn } from './src/selection-column.js';
import { GridSortColumn } from './src/sort-column.js';
import { GridTextFieldColumn } from './src/text-field-column.js';

customElements.define('sl-grid', Grid);
customElements.define('sl-grid-column', GridColumn);
customElements.define('sl-grid-column-group', GridColumnGroup);
customElements.define('sl-grid-drag-handle-column', GridDragHandleColumn);
customElements.define('sl-grid-filter-column', GridFilterColumn);
customElements.define('sl-grid-select-column', GridSelectColumn);
customElements.define('sl-grid-selection-column', GridSelectionColumn);
customElements.define('sl-grid-sort-column', GridSortColumn);
customElements.define('sl-grid-text-field-column', GridTextFieldColumn);

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-active-item-change': GridActiveItemChangeEvent<any>;
    'sl-filter-value-change': GridFilterValueChangeEvent<any>;
    'sl-grid-dragstart': GridItemEvent<any>;
    'sl-grid-dragenter': GridItemEvent<any>;
    'sl-grid-dragend': GridItemEvent<any>;
    'sl-grid-drop': GridItemEvent<any>;
    'sl-grid-items-change': GridEvent<any>;
    'sl-grid-state-change': GridEvent<any>;
    'sl-sort-direction-change': GridSortDirectionChangeEvent<any>;
  }

  interface HTMLElementTagNameMap {
    'sl-grid': Grid;
    'sl-grid-column': GridColumn;
    'sl-grid-column-group': GridColumnGroup;
    'sl-grid-drag-handle-column': GridDragHandleColumn;
    'sl-grid-filter-column': GridFilterColumn;
    'sl-grid-select-column': GridSelectColumn;
    'sl-grid-selection-column': GridSelectionColumn;
    'sl-grid-sort-column': GridSortColumn;
    'sl-grid-text-field-column': GridTextFieldColumn;
  }
}
