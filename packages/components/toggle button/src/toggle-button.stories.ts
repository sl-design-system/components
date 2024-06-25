import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type ToggleButton } from './toggle-button.js';

type Props = Pick<ToggleButton, 'size' | 'variant'> & { icon?: boolean; text?: string };
type Story = StoryObj<Props>;

export default {
  title: 'Components/ToggleButton',
  tags: ['draft'],
  render: () => html`
    <sl-toggle-button>
      <sl-icon name="check"></sl-icon>
    </sl-toggle-button>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
