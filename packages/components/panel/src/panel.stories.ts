import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Panel } from './panel.js';

type Props = Pick<Panel, 'collapsed' | 'collapsible' | 'heading' | 'outline' | 'subtitle'> & {
  actions?(): string | TemplateResult;
  badge?(): string | TemplateResult;
  content?(): string | TemplateResult;
  prefix?(): string | TemplateResult;
  suffix?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Layout/Panel',
  tags: ['draft'],
  args: {
    collapsible: false,
    outline: true
  },
  argTypes: {
    actions: {
      table: { disable: true }
    },
    badge: {
      table: { disable: true }
    },
    collapsed: {
      control: 'boolean'
    },
    content: {
      table: { disable: true }
    },
    prefix: {
      table: { disable: true }
    },
    suffix: {
      table: { disable: true }
    }
  },
  render: ({ actions, badge, collapsed, collapsible, content, heading, outline, prefix, subtitle, suffix }) => {
    return html`
      <sl-panel
        ?collapsed=${collapsible && collapsed}
        ?collapsible=${collapsible}
        .heading=${heading}
        .outline=${outline}
        .subtitle=${subtitle}
      >
        ${actions?.()}${badge?.()}${content?.()}${prefix?.()}${suffix?.()}
      </sl-panel>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    badge: () =>
      html`<sl-badge slot="badge" emphasis="subtle" size="lg" variant="info">prefix</sl-badge
        ><sl-badge slot="badge" emphasis="subtle" size="lg" variant="success">prefix</sl-badge>`,
    content: () => html`<p>Panel content</p>`,
    prefix: () => html`<sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>`,
    suffix: () => html`<sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix</sl-badge>`,
    heading: 'Panel heading',
    subtitle: 'Panel subtitle'
  }
};

export const WithPrefix: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<p>Panel content</p>`,
    prefix: () => html`<sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>`,
    heading: 'Panel heading',
    subtitle: 'Panel subtitle'
  }
};

export const WithSuffix: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<p>Panel content</p>`,
    suffix: () => html`<sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix</sl-badge>`,
    heading: 'Panel heading',
    subtitle: 'Panel subtitle'
  }
};

export const Collapsible: Story = {
  args: {
    ...Basic.args,
    collapsible: true
  }
};

export const Collapsed: Story = {
  args: {
    ...Collapsible.args,
    collapsed: true
  }
};

export const OverflowHeading: Story = {
  args: {
    ...Basic.args,
    heading:
      'This panel heading is really long and will overflow the panel if it is too narrow. Quis amet non cupidatat ex non esse incididunt officia magna officia proident.',
    content: () => 'The heading should overflow and not be truncated. Any actions should still be aligned at the top.'
  }
};

export const OverflowActions: Story = {
  args: {
    ...Basic.args,
    actions: () => html`
      <sl-button fill="outline" slot="actions">Action 1</sl-button>
      <sl-button fill="outline" slot="actions">Action 2</sl-button>
      <sl-button fill="outline" slot="actions">Action 3</sl-button>
      <sl-button fill="outline" slot="actions">Action 4</sl-button>
      <sl-button fill="outline" slot="actions">Action 5</sl-button>
      <sl-button fill="outline" slot="actions">Action 6</sl-button>
      <sl-button fill="outline" slot="actions">Action 7</sl-button>
    `,
    content: () => "If you add too many actions that won't fit on 1 line, it will add a menu button for the overflow."
  }
};

export const WithoutActions: Story = {
  args: {
    ...OverflowHeading.args,
    actions: undefined
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
