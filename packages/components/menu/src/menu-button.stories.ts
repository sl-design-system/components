import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type MenuButton } from './menu-button.js';

type Props = Pick<MenuButton, 'disabled' | 'fill' | 'selects' | 'size' | 'variant'> & {
  body: string | TemplateResult;
  menuItems?: () => TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Menu button',
  parameters: {
    layout: 'centered'
  },
  args: {
    body: 'Button',
    disabled: false,
    fill: 'solid',
    size: 'md',
    variant: 'default'
  },
  render: ({ body, disabled, fill, menuItems, selects, size, variant }) => {
    return html`
      <sl-menu-button .disabled=${disabled} .fill=${fill} .selects=${selects} .size=${size} .variant=${variant}>
        <div slot="button">${body}</div>
        ${menuItems?.()}
      </sl-menu-button>
    `;
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
