import { Grid } from './grid.js';
import { GridColumn } from './column.js';
import { GridSelectionColumn } from './selection-column.js';

customElements.define('sl-grid', Grid);
customElements.define('sl-grid-column', GridColumn);
customElements.define('sl-grid-selection-column', GridSelectionColumn);

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid': Grid;
    'sl-grid-column': GridColumn;
    'sl-grid-selection-column': GridSelectionColumn;
  }
}
