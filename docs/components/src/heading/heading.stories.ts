import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { Heading } from './heading.js';

type Props = Pick<Heading, 'level'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-heading', Heading);
} catch {
  /* empty */
}

export default {
  title: 'Heading',
  args: {
    level: 2
  },
  argTypes: {
    level: {
      control: 'inline-radio',
      options: [2, 3]
    }
  },
  render: ({ level }) => html`
    <doc-heading id="my-heading" .level=${level}>Section Title</doc-heading>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Level3: Story = {
  args: {
    level: 3
  }
};

export const WithoutId: Story = {
  render: ({ level }) => html`
    <doc-heading .level=${level}>No copy button without an id</doc-heading>
  `
};
