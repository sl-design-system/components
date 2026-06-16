import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { CopyButton } from './copy-button.js';

type Props = Pick<CopyButton, 'target' | 'fill'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-copy-button', CopyButton);
} catch {
  /* empty */
}

export default {
  title: 'Copy Button',
  args: {
    target: 'copy-target'
  },
  argTypes: {
    target: {
      control: 'text'
    },
    fill: {
      control: 'select',
      options: ['solid', 'outline', 'link', 'ghost']
    }
  },
  render: ({ target, fill }) => html`
    <p id="copy-target">This text will be copied to the clipboard.</p>
    <doc-copy-button .target=${target} .fill=${fill}></doc-copy-button>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Outline: Story = {
  args: {
    fill: 'outline'
  }
};

export const WithDifferentTarget: Story = {
  render: ({ target }) => html`
    <pre id="code-snippet">const foo = 'bar';</pre>
    <doc-copy-button .target=${target}></doc-copy-button>
  `,
  args: {
    target: 'code-snippet'
  }
};
