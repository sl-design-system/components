import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Props = { text: string; width: number };
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Ellipsize Text',
  tags: ['draft'],
  render: ({ text, width }) => html`<sl-ellipsize-text style="width: ${width}px">${text}</sl-ellipsize-text>`
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    width: 200,
    text: 'This is a long text that should be truncated'
  }
};
