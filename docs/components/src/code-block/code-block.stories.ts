import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { Code } from './code-block.js';

type Story = StoryObj;

try {
  customElements.define('doc-code-block', Code);
} catch {
  /* empty */
}

export default {
  title: 'Code',
  render: () => html`
    <doc-code-block>
      <pre><code class="language-typescript">import { LitElement, html } from 'lit';

export class MyElement extends LitElement {
  override render() {
    return html\`&lt;p&gt;Hello world!&lt;/p&gt;\`;
  }
}</code></pre>
    </doc-code-block>
  `
} satisfies Meta;

export const Basic: Story = {};

export const MultiLine: Story = {
  render: () => html`
    <doc-code-block>
      <pre><code class="language-html">&lt;sl-button variant="primary"&gt;Click me&lt;/sl-button&gt;
&lt;sl-button variant="default"&gt;Cancel&lt;/sl-button&gt;</code></pre>
    </doc-code-block>
  `
};

export const CSS: Story = {
  render: () => html`
    <doc-code-block>
      <pre><code class="language-css">:host {
  display: block;
  color: red;
}</code></pre>
    </doc-code-block>
  `
};
