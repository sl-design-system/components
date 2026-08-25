import { GridColumnGroup } from './src/column-group.js';
import { GridColumn } from './src/column.js';
import { GridDragHandleColumn } from './src/drag-handle-column.js';
import { GridFilterColumn } from './src/filter-column.js';
import { Grid } from './src/grid.js';
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
