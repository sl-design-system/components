import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CodeExample } from './code-example.js';

type Props = Pick<CodeExample, 'inverted' | 'justify' | 'showSource'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-code-example', CodeExample);
} catch {
  /* empty */
}

export default {
  title: 'Code Example',
  argTypes: {
    inverted: {
      control: { type: 'boolean' }
    },
    justify: {
      control: { type: 'inline-radio' },
      options: ['start', 'center', 'end', 'stretch']
    },
    showSource: {
      control: { type: 'boolean' }
    }
  },
  render: ({ inverted, justify, showSource }) => html`
    <doc-code-example ?inverted=${inverted} justify=${ifDefined(justify)} ?show-source=${showSource}>
      <sl-button .variant=${inverted ? 'inverted' : undefined}>Click me</sl-button>
      <pre slot="source"><code>&lt;sl-button&gt;Click me&lt;/sl-button&gt;</code></pre>
    </doc-code-example>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Inverted: Story = {
  args: {
    inverted: true
  }
};
export const JustifyCenter: Story = {
  args: {
    justify: 'center'
  }
};

export const JustifyStretch: Story = {
  args: {
    justify: 'stretch'
  }
};

export const ShowSource: Story = {
  args: {
    showSource: true
  }
};
