import type { Breadcrumbs } from './breadcrumbs.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Props = typeof Breadcrumbs;
type Story = StoryObj<Props>;

export default {
  title: 'Breadcrumbs',
  render: () => html`<sl-breadcrumbs></sl-breadcrumbs>`
} satisfies Meta<Props>;

export const Basic: Story = {};
