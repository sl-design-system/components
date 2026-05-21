import { faGear, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/card/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import { html } from 'lit';
import { Tooltip2 } from './tooltip2.js';

try {
  customElements.define('sl-tooltip2', Tooltip2);
} catch {
  /* empty */
}

Icon.register(faGear, faPen, faTrash, fasGear);

export default {
  title: 'Overlay/Tooltip2/Edge cases'
};

export const DisabledButtons = {
  render: () => html`
    <sl-button-bar>
      <sl-button disabled id="button">Disabled attribute</sl-button>
      <sl-tooltip2 for="button">Tooltip text</sl-tooltip2>

      <sl-button aria-disabled="true" id="button2">ARIA disabled</sl-button>
      <sl-tooltip2 for="button2">Tooltip text</sl-tooltip2>
    </sl-button-bar>
  `
};

export const MenuButton = {
  render: () => html`
    <sl-menu-button id="menu-button">
      <sl-icon name="far-gear" slot="button"></sl-icon>
      <sl-menu-item>
        <sl-icon name="far-pen"></sl-icon>
        Rename...
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-trash"></sl-icon>
        Delete...
      </sl-menu-item>
    </sl-menu-button>
    <sl-tooltip2 for="menu-button">Tooltip text</sl-tooltip2>
  `
};

export const Nested = {
  render: () => html`
    <sl-card id="card">
      <h2>Card title</h2>
      <sl-button-bar>
        <sl-button id="button">Hover me</sl-button>
        <sl-tooltip2 for="button">Tooltip text</sl-tooltip2>
      </sl-button-bar>
    </sl-card>
    <sl-tooltip2 for="card">Card tooltip</sl-tooltip2>
  `
};
