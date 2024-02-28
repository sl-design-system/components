import { Menu } from './src/menu.js';
import { MenuItem } from './src/menu-item.js';
import { MenuItemGroup } from './src/menu-item-group.js';
import { MenuButton } from './src/menu-button.js';

customElements.define('sl-menu', Menu);
customElements.define('sl-menu-button', MenuButton);
customElements.define('sl-menu-item', MenuItem);
customElements.define('sl-menu-item-group', MenuItemGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sl-menu': Menu;
    'sl-menu-button': MenuButton;
    'sl-menu-item': MenuItem;
    'sl-menu-item-group': MenuItemGroup;
  }
}
