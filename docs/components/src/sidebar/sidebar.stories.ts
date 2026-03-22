import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

type Story = StoryObj;

try {
  const { Sidebar } = await import('./sidebar.js');
  customElements.define('doc-sidebar', Sidebar);
} catch {
  /* empty */
}

export default {
  title: 'Sidebar',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  render: () => html`
    <style>
      .layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        min-block-size: 100dvh;
      }
      .content {
        padding: 2rem;
      }
    </style>
    <div class="layout">
      <doc-sidebar>
        <doc-nav-item heading="Home" href="/"></doc-nav-item>
        <doc-nav-group heading="Getting Started">
          <doc-nav-item heading="Introduction" href="/getting-started/introduction/"></doc-nav-item>
          <doc-nav-item heading="Installation" href="/getting-started/installation/"></doc-nav-item>
        </doc-nav-group>
        <doc-nav-group heading="Components">
          <doc-nav-item heading="Button" href="/components/button/"></doc-nav-item>
          <doc-nav-item heading="Accordion" href="/components/accordion/"></doc-nav-item>
          <doc-nav-item heading="Dialog" href="/components/dialog/"></doc-nav-item>
          <doc-nav-item heading="Tooltip" href="/components/tooltip/"></doc-nav-item>
        </doc-nav-group>
      </doc-sidebar>
      <main class="content">
        <h1>Page Title</h1>
        <p>Main content area. The sidebar should remain fixed while this content scrolls.</p>
      </main>
    </div>
  `
} satisfies Meta;

export const Basic: Story = {};
