import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

type Props = ToolBar;
type Story = StoryObj<Props>;

export default {
  title: 'Components/Tool bar',
  tags: ['draft'],
  render: () => {
    return html`<sl-tool-bar></sl-tool-bar>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
