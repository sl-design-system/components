import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { Search } from './search.js';

type Story = StoryObj;

try {
  customElements.define('doc-search', Search);
} catch {
  /* empty */
}

export default {
  title: 'Search',
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
