import { MenuButton } from './src/menu-button.js';
import { MenuItemGroup } from './src/menu-item-group.js';
import { MenuItem } from './src/menu-item.js';
import { Menu } from './src/menu.js';

customElements.define('sl-menu', Menu);
customElements.define('sl-menu-button', MenuButton);
customElements.define('sl-menu-item', MenuItem);
customElements.define('sl-menu-item-group', MenuItemGroup);
