import '../button-bar/register.js';
import { Drawer } from './drawer.js';

customElements.define('sl-drawer', Drawer);

declare global {
  interface HTMLElementTagNameMap {
    'sl-drawer': Drawer;
  }
}
