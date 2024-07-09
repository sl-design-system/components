import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type ExpansionPanel } from './expansion-panel.js';

type Props = Pick<ExpansionPanel, 'expanded'>;
type Story = StoryObj<Props>;

export default {
  title: 'Layout/Expansion panel',
  tags: ['draft'],
  args: {
    expanded: false
  },
  render: ({ expanded }) => {
    return html`<sl-expansion-panel ?expanded=${expanded}></sl-expansion-panel>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Expanded: Story = {
  args: {
    expanded: true
  }
};
