import { faArrowUpShortWide, faLayerGroup, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Menu } from './menu.js';

type Props = Pick<Menu, 'selects'> & { menuItems: () => TemplateResult };
type Story = StoryObj<Props>;

Icon.register(faArrowUpShortWide, faLayerGroup, faPen, faTrash);

export default {
  title: 'Menu',
  parameters: {
    layout: 'centered'
  },
  render: ({ menuItems, selects }) => {
    return html`<sl-menu .selects=${selects} style="width: 200px">${menuItems()}</sl-menu>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    menuItems: () => html`
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

export const SingleSelect: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item selectable selected>
        Lorem
        <kbd>⌘1</kbd>
      </sl-menu-item>
      <sl-menu-item selectable>
        Ipsum
        <kbd>⌘2</kbd>
      </sl-menu-item>
      <sl-menu-item selectable>
        Dolar
        <kbd>⌘3</kbd>
      </sl-menu-item>
    `,
    selects: 'single'
  }
};

export const MultiSelect: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item selectable selected>Lorem</sl-menu-item>
      <sl-menu-item selectable>Ipsum</sl-menu-item>
      <sl-menu-item selectable>Dolar</sl-menu-item>
    `,
    selects: 'multiple'
  }
};

export const ComboSelect: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item-group selects="multiple">
        <sl-menu-item selectable selected>Lorem</sl-menu-item>
        <sl-menu-item selectable>Ipsum</sl-menu-item>
        <sl-menu-item selectable>Dolar</sl-menu-item>
      </sl-menu-item-group>
      <hr />
      <sl-menu-item selectable selected>Foo bar</sl-menu-item>
    `
  }
};

export const Combination: Story = {
  args: {
    menuItems: () => html`
      <sl-menu-item-group selects="single">
        <sl-menu-item selected>
          Lorem
          <kbd>⌘1</kbd>
        </sl-menu-item>
        <sl-menu-item>
          Ipsum
          <kbd>⌘2</kbd>
        </sl-menu-item>
        <sl-menu-item>
          Dolar
          <kbd>⌘3</kbd>
        </sl-menu-item>
      </sl-menu-item-group>
      <hr />
      <sl-menu-item>
        <sl-icon name="far-arrow-up-short-wide"></sl-icon>
        Sort by
        <sl-menu selects="single" slot="submenu" style="width: 150px">
          <sl-menu-item selectable selected>First name (A-Z)</sl-menu-item>
          <sl-menu-item selectable>First name (Z-A)</sl-menu-item>
          <sl-menu-item selectable>Last name (A-Z)</sl-menu-item>
          <sl-menu-item selectable>Last name (Z-A)</sl-menu-item>
        </sl-menu>
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-layer-group"></sl-icon>
        Group by
        <sl-menu selects="single" slot="submenu">
          <sl-menu-item selectable selected>Something</sl-menu-item>
          <sl-menu-item selectable>Other</sl-menu-item>
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
