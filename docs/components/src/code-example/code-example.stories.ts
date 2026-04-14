import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { CodeExample } from './code-example.js';

type Story = StoryObj;

try {
  customElements.define('doc-code-example', CodeExample);
} catch {
  /* empty */
}

export default {
  title: 'Code Example'
} satisfies Meta;

export const Basic: Story = {
  render: () => {
    const el = document.createElement('doc-code-example');

    el.innerHTML = `
      <button type="button">Click me</button>
      <pre slot="source"><code>&lt;button type="button"&gt;Click me&lt;/button&gt;</code></pre>
    `;

    return el;
  }
};

export const WithSource: Story = {
  render: () => {
    const el = document.createElement('doc-code-example');

    el.innerHTML = `
      <p>Hello <strong>world</strong></p>
      <pre slot="source"><code>&lt;p&gt;Hello &lt;strong&gt;world&lt;/strong&gt;&lt;/p&gt;</code></pre>
    `;

    return el;
  }
};
