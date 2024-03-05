import { Spinner } from './src/spinner.js';

customElements.define('sl-spinner', Spinner);

declare global {
  interface HTMLElementTagNameMap {
    'sl-spinner': Spinner;
  }
}
