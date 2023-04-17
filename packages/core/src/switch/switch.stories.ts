import type { Switch } from './switch.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

type Props = Pick<Switch, 'checked'>;

export default {
  title: 'Switch',
  args: {
    checked: false
  },
  render: ({ checked }) => html` <sl-switch ?checked=${checked}></sl-switch>`
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};
