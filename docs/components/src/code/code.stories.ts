import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { Code } from './code.js';

type Story = StoryObj;

try {
  customElements.define('doc-code', Code);
} catch {
  /* empty */
}

export default {
  title: 'Code',
  render: () => html`
    <doc-code>
      <pre><code class="language-typescript">import { LitElement, html } from 'lit';

export class MyElement extends LitElement {
  override render() {
    return html\`&lt;p&gt;Hello world!&lt;/p&gt;\`;
  }
}</code></pre>
    </doc-code>
  `
} satisfies Meta;

export const Basic: Story = {};

export const MultiLine: Story = {
  render: () => html`
    <doc-code>
      <pre><code class="language-html">&lt;sl-button variant="primary"&gt;Click me&lt;/sl-button&gt;
&lt;sl-button variant="default"&gt;Cancel&lt;/sl-button&gt;</code></pre>
    </doc-code>
  `
};

export const CSS: Story = {
  render: () => html`
    <doc-code>
      <pre><code class="language-css">:host {
  display: block;
  color: red;
}</code></pre>
    </doc-code>
  `
};
