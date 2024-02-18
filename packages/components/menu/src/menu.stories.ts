import { faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';

interface Props {
  menuItems: () => TemplateResult;
}
type Story = StoryObj<Props>;

Icon.register(faPen, faTrash);

export default {
  title: 'Menu',
  parameters: {
    layout: 'centered'
  },
  render: ({ menuItems }) => {
    return html`<sl-menu style="width: 200px">${menuItems()}</sl-menu>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item-group selects="single">
        <sl-menu-item>Lorem</sl-menu-item>
        <sl-menu-item>Ipsum</sl-menu-item>
        <sl-menu-item>Dolar</sl-menu-item>
      </sl-menu-item-group>
      <hr />
      <sl-menu-item>
        Sort by
        <sl-menu slot="submenu">
          <sl-menu-item>Ascending</sl-menu-item>
          <sl-menu-item>Descending</sl-menu-item>
        </sl-menu>
      </sl-menu-item>
      <sl-menu-item>
        Group by
        <sl-menu slot="submenu">
          <sl-menu-item>Something</sl-menu-item>
          <sl-menu-item>Other</sl-menu-item>
        </sl-menu>
      </sl-menu-item>
      <hr />
      <sl-menu-item>
        <sl-icon name="far-pen"></sl-icon>
        Rename...
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-trash"></sl-icon>
        Delete...
      </sl-menu-item>
    `
  }
};
