import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Paginator } from './paginator.js';

type Props = Pick<Paginator, 'collapsed' | 'collapsible' | 'heading' | 'itemsPerPage' | 'pageSizes' | 'total'> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Layout/Paginator',
  tags: ['draft'],
  args: {
    collapsible: false,
    total: 50,
    itemsPerPage: 15,
    pageSizes: [5, 10, 15]
  },
  argTypes: {
    actions: {
      table: { disable: true }
    },
    collapsed: {
      control: 'boolean'
    },
    content: {
      table: { disable: true }
    }
  },
  render: ({ itemsPerPage, pageSizes, total }) => {
    return html` <sl-paginator .total=${total} .itemsPerPage=${itemsPerPage} .pageSizes=${pageSizes}></sl-paginator> `;
  }
} satisfies Meta<Props>;

// TODO: is slot necessary?

export const Basic: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<p>Panel content</p>`,
    heading: 'Panel heading'
  }
};

export const Overflow: Story = {
  args: {
    ...Basic.args,
    total: 1000,
    heading:
      'This panel heading is really long and will overflow the panel if it is too narrow. Quis amet non cupidatat ex non esse incididunt officia magna officia proident.',
    content: () => 'The heading should overflow and not be truncated. Any actions should still be aligned at the top.'
  }
};

export const All: Story = {
  render: () => html`
    <style>
      #root-inner {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    </style>
    <sl-panel heading="Panel 1">Panel 1 content</sl-panel>
    <sl-panel heading="Panel 2">
      Panel 2 content
      <sl-button fill="outline" slot="actions">Action</sl-button>
    </sl-panel>
    <sl-panel collapsible heading="Panel 3">Panel 3 content</sl-panel>
    <sl-panel collapsible collapsed heading="Panel 4">
      Panel 4 content
      <sl-button fill="outline" slot="actions">Action</sl-button>
    </sl-panel>
    <sl-panel collapsible collapsed heading="Panel 5; Eu quis Lorem laboris veniam reprehenderit esse tempor fugiat.">
      Panel 5 content.
      <sl-button fill="outline" slot="actions">Action</sl-button>
      <sl-button fill="outline" slot="actions">Action</sl-button>
      <sl-button fill="outline" slot="actions">Action</sl-button>
      <sl-button fill="outline" slot="actions">Action</sl-button>
      <sl-button fill="outline" slot="actions">Action</sl-button>
    </sl-panel>
  `
};
