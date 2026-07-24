import { faGear, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/card/register.js';
import '@sl-design-system/dialog/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/toggle-button/register.js';
import '@sl-design-system/toggle-group/register.js';
import { html } from 'lit';
import '../register.js';

Icon.register(faGear, faPen, faTrash, fasGear);

export default {
  title: 'Overlay/Tooltip/Edge cases'
};

export const Dialog = {
  render: () => html`
    <style>
      sl-button::part(tooltip) {
        max-inline-size: 200px;
      }
    </style>
    <sl-button
      command="--show-modal"
      commandfor="dialog"
      tooltip="This tooltip should be visible after closing the dialog if you're using the keyboard.">
      Open dialog
    </sl-button>
    <sl-dialog id="dialog" close-button>
      <h1 slot="title">Dialog title</h1>
      <sl-button slot="primary-actions" command="--close" commandfor="dialog">Close</sl-button>
    </sl-dialog>
  `
};

export const DisabledButtons = {
  render: () => html`
    <sl-button-bar>
      <sl-button disabled tooltip="This tooltip should not be visible">
        Disabled attribute
      </sl-button>
      <sl-button
        aria-disabled="true"
        tooltip="This tooltip is visible because the button is ARIA disabled">
        ARIA disabled
      </sl-button>
    </sl-button-bar>
  `
};

export const MenuButton = {
  render: () => html`
    <sl-menu-button
      id="menu-button"
      tooltip="This tooltip should not be visible when the menu is open.">
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
  `
};

export const Nested = {
  render: () => html`
    <sl-card id="card">
      <h2>Card title</h2>
      <sl-button-bar>
        <sl-button id="button">Hover me</sl-button>
        <sl-tooltip for="button">Tooltip text</sl-tooltip>
      </sl-button-bar>
    </sl-card>
    <sl-tooltip for="card">Card tooltip</sl-tooltip>
  `
};
