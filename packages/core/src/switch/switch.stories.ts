import type { Switch } from './switch.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

type Props = Pick<Switch, 'state'>;

export default {
  title: 'Switch',
  render: () => html` <sl-switch></sl-switch> `
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};
