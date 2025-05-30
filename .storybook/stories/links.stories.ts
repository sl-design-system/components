import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

type Props = {};
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Links',
  tags: ['stable'],
  parameters: {},
  args: {},
  argTypes: {},
  render: () => html`
    In the theme is a global.css file containing styling for links.
    This works as a global style for links in your application and links in the light dom of SLDS components.
    <br/>
    <a href="https://www.sanomalearning.design" target="_blank">Sanoma Learning Design system</a>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
