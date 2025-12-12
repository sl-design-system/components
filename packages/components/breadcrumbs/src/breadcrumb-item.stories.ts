import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';
import { type BreadcrumbItem } from './breadcrumb-item.js';

type Props = Pick<BreadcrumbItem, 'current' | 'disabled'> & { label: string };
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Breadcrumbs/Breadcrumb Item',
  tags: ['stable'],
  args: {
    label: 'Breadcrumb'
  },
  argTypes: {
    label: {
      control: 'text'
    }
  },
  render: ({ current, disabled, label }) => html`
    <sl-breadcrumb-item .current=${current} .disabled=${disabled}>${label}</sl-breadcrumb-item>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Current: Story = {
  args: {
    current: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const WithIcon: Story = {
  render: ({ current, disabled, label }) => html`
    <sl-breadcrumb-item .current=${current} .disabled=${disabled}>
      <sl-icon slot="icon" name="home-blank"></sl-icon>
      ${label}
    </sl-breadcrumb-item>
  `
};

export const LongText: Story = {
  args: {
    label: 'This is a very long breadcrumb item that should be truncated with an ellipsis'
  },
  decorators: [story => html`<div style="width: 200px;">${story()}</div>`]
};
