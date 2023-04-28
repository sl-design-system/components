import { Drawer } from './src/drawer.js';

customElements.define('sl-drawer', Drawer);

declare global {
  interface HTMLElementTagNameMap {
    'sl-drawer': Drawer;
  }
}
