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
  title: 'Inline Code',
  render: () => html`<p>Use the <doc-code>:state(active)</doc-code> selector to target this state.</p>`
} satisfies Meta;

export const Basic: Story = {};

export const Standalone: Story = {
  render: () => html`<doc-code>const foo = 'bar';</doc-code>`
};
