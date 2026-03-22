import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

type Story = StoryObj;

try {
  const { Search } = await import('./search.js');
  customElements.define('doc-search', Search);
} catch {
  /* empty */
}

export default {
  title: 'Search',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  },
  render: () => html`
    <style>
      doc-search {
        max-inline-size: 280px;
      }
    </style>
    <doc-search></doc-search>
  `
} satisfies Meta;

export const Basic: Story = {};
