import { faGear, faRocket, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

Icon.register(faGear, faRocket, faTrash);

export default {
  title: 'Actions/Menu',
  tags: ['draft'],
  parameters: {
    layout: 'centered'
  }
} as Meta;

export const Example: Story = {
  render: () => {
    return html`
      <sl-menu-button aria-label="Label">
        <sl-icon name="far-gear" slot="button"></sl-icon>
        <sl-menu-item selectable selected shortcut="$mod+Digit1">
          <sl-icon name="far-rocket"></sl-icon>
          Default
        </sl-menu-item>
        <sl-menu-item disabled shortcut="$mod+Digit2">
          <sl-icon name="far-rocket"></sl-icon>
          Default, disabled
        </sl-menu-item>
        <hr />
        <sl-menu-item>
          <sl-icon name="far-gear"></sl-icon>
          Submenu
          <sl-menu selects="single" slot="submenu">
            <sl-menu-item selectable selected>Something</sl-menu-item>
            <sl-menu-item selectable>Other</sl-menu-item>
          </sl-menu>
        </sl-menu-item>
        <sl-menu-item disabled>
          <sl-icon name="far-gear"></sl-icon>
          Submenu, disabled
          <sl-menu selects="single" slot="submenu">
            <sl-menu-item selectable selected>Something</sl-menu-item>
            <sl-menu-item selectable>Other</sl-menu-item>
          </sl-menu>
        </sl-menu-item>
        <sl-menu-item-group heading="Group heading">
          <sl-menu-item variant="danger">
            <sl-icon name="far-trash"></sl-icon>
            Danger
          </sl-menu-item>
          <sl-menu-item disabled variant="danger">
            <sl-icon name="far-trash"></sl-icon>
            Danger, disabled
          </sl-menu-item>
        </sl-menu-item-group>
      </sl-menu-button>
    `;
  }
};
