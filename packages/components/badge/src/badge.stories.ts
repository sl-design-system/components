import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import { html } from 'lit';
import '../register.js';

interface Props {}

type Story = StoryObj<Props>;

export default {
  title: 'Button bar',
  args: {},
  argTypes: {},
  render: () => html` <sl-badge> 99+ </sl-badge> `
} satisfies Meta<Props>;

export const Basic: Story = {};
