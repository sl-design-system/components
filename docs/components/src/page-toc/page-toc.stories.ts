import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PageToc } from './page-toc.js';

type Props = Pick<PageToc, 'target'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-page-toc', PageToc);
} catch {
  /* empty */
}

export default {
  title: 'Page Table of Contents',
  args: {
    target: '.page'
  },
  render: ({ target }) => {
    return html`
      <div class="page">
        <h1>Page Heading</h1>
        <h2 id="heading-1">Heading 1</h2>
        <h2 id="heading-2">Heading 2</h2>
        <h3 id="heading-2-1">Heading 2.1</h3>
        <h2 id="heading-3">Heading 3</h2>
        <h3 id="heading-3-1">Heading 3.1</h3>
      </div>
      <doc-page-toc target=${ifDefined(target)}></doc-page-toc>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
