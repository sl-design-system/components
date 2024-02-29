import { Breadcrumbs } from './src/breadcrumbs.js';

customElements.define('sl-breadcrumbs', Breadcrumbs);

declare global {
  interface HTMLElementTagNameMap {
    'sl-breadcrumbs': Breadcrumbs;
  }
}
