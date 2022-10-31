import { Grid } from './grid.js';
import { GridColumn } from './column.js';

customElements.define('sl-grid', Grid);
customElements.define('sl-grid-column', GridColumn);

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid': Grid;
    'sl-grid-column': GridColumn;
  }
}
