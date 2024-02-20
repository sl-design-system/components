import { faGear, faList, faRectanglesMixed, faTableCells } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '@sl-design-system/icon/register.js';
import '../register.js';
import { type MenuButton } from './menu-button.js';

type Props = Pick<MenuButton, 'disabled' | 'fill' | 'selects' | 'size' | 'variant'> & {
  body: string | TemplateResult;
  menuItems?: () => TemplateResult;
};
type Story = StoryObj<Props>;

Icon.register(faGear, faList, faRectanglesMixed, faTableCells);

export default {
  title: 'Menu button',
  parameters: {
    layout: 'centered'
  },
  args: {
    body: 'Button',
    disabled: false,
    fill: 'outline',
    size: 'md',
    variant: 'default'
  },
  render: ({ body, disabled, fill, menuItems, selects, size, variant }) => {
    return html`
      <sl-menu-button .disabled=${disabled} .fill=${fill} .selects=${selects} .size=${size} .variant=${variant}>
        ${body ?? html`<div slot="button">${body}</div>`} ${menuItems?.()}
      </sl-menu-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    body: html`<sl-icon name="far-gear" slot="button"></sl-icon>`,
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
    body: html`<span slot="button">View:</span>`,
    menuItems: () => html`
      <sl-menu-item selectable selected shortcut="$mod+Digit1">
        <sl-icon name="far-list"></sl-icon>
        List
      </sl-menu-item>
      <sl-menu-item selectable shortcut="$mod+Digit2">
        <sl-icon name="far-rectangles-mixed"></sl-icon>
        Cards
      </sl-menu-item>
      <sl-menu-item selectable shortcut="$mod+Digit3">
        <sl-icon name="far-table-cells"></sl-icon>
        Grid
      </sl-menu-item>
    `,
    selects: 'single'
  }
};

export const MultiSelect: Story = {};

export const All: Story = {
  args: {
    body: html`<sl-icon name="far-gear" slot="button"></sl-icon>`,
    menuItems: () => html`
      <sl-menu-item-group selects="single">
        <sl-menu-item selectable selected shortcut="$mod+Digit1">
          <sl-icon name="far-list"></sl-icon>
          List
        </sl-menu-item>
        <sl-menu-item selectable shortcut="$mod+Digit2">
          <sl-icon name="far-rectangles-mixed"></sl-icon>
          Cards
        </sl-menu-item>
        <sl-menu-item selectable shortcut="$mod+Digit3">
          <sl-icon name="far-table-cells"></sl-icon>
          Grid
        </sl-menu-item>
      </sl-menu-item-group>
      <hr />
      <sl-menu-item>
        <sl-icon name="far-arrow-up-short-wide"></sl-icon>
        Sort by
        <sl-menu selects="single" slot="submenu">
          <sl-menu-item selectable selected>First name (A-Z)</sl-menu-item>
          <sl-menu-item selectable>First name (Z-A)</sl-menu-item>
          <sl-menu-item selectable>Last name (A-Z)</sl-menu-item>
          <sl-menu-item selectable>Last name (Z-A)</sl-menu-item>
        </sl-menu>
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-table-rows"></sl-icon>
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
      <sl-menu-item disabled>
        <sl-icon name="far-trash"></sl-icon>
        Delete...
      </sl-menu-item>
    `
  }
};
