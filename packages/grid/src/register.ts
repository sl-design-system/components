import { Grid } from './grid.js';

customElements.define('sl-grid', Grid);

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid': Grid;
  }
}
