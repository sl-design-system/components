import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Panel, PanelElevation, type SubtitlePlacement, type TogglePlacement } from './panel.js';

type Props = Pick<
  Panel,
  | 'badgesPlacement'
  | 'collapsed'
  | 'collapsible'
  | 'elevation'
  | 'heading'
  | 'noPadding'
  | 'outline'
  | 'subtitle'
  | 'subtitlePlacement'
  | 'togglePlacement'
> & {
  actions?(): string | TemplateResult;
  badge?(): string | TemplateResult;
  content?(): string | TemplateResult;
  prefix?(): string | TemplateResult;
  suffix?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

const togglePlacements: TogglePlacement[] = ['start', 'end'];

const placements: SubtitlePlacement[] = ['bottom', 'top'];

const elevations: PanelElevation[] = ['none', 'raised', 'sunken'];

export default {
  title: 'Layout/Panel',
  tags: ['draft'],
  args: {
    badgesPlacement: 'bottom',
    collapsible: false,
    elevation: 'none',
    noPadding: false,
    outline: true,
    subtitlePlacement: 'bottom',
    togglePlacement: 'start'
  },
  argTypes: {
    actions: {
      table: { disable: true }
    },
    badge: {
      table: { disable: true }
    },
    badgesPlacement: {
      control: 'radio',
      options: placements
    },
    collapsed: {
      control: 'boolean'
    },
    content: {
      table: { disable: true }
    },
    elevation: {
      control: 'radio',
      options: elevations
    },
    prefix: {
      table: { disable: true }
    },
    subtitlePlacement: {
      control: 'radio',
      options: placements
    },
    suffix: {
      table: { disable: true }
    },
    togglePlacement: {
      control: 'radio',
      options: togglePlacements
    }
  },
  render: ({
    actions,
    badge,
    badgesPlacement,
    collapsed,
    collapsible,
    content,
    elevation,
    heading,
    noPadding,
    outline,
    prefix,
    subtitle,
    subtitlePlacement,
    suffix,
    togglePlacement
  }) => {
    return html`
      <sl-panel
        ?collapsed=${collapsible && collapsed}
        ?collapsible=${collapsible}
        .badgesPlacement=${badgesPlacement}
        .heading=${heading}
        .elevation=${elevation}
        .noPadding=${noPadding}
        .outline=${outline}
        .subtitle=${subtitle}
        .subtitlePlacement=${subtitlePlacement}
        .togglePlacement=${togglePlacement}
      >
        ${actions?.()}${badge?.()}${content?.()}${prefix?.()}${suffix?.()}
      </sl-panel>
    `;
  }
} satisfies Meta<Props>;

// TODO: prefix and suffix examples

export const Basic: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    badge: () =>
      html`<sl-badge slot="badge" emphasis="subtle" size="lg" variant="info">badge</sl-badge
        ><sl-badge slot="badge" emphasis="subtle" size="lg" variant="success">badge</sl-badge>`,
    content: () => html`<span>Panel content</span>`,
    prefix: () => html`<sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>`,
    suffix: () => html`<sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix</sl-badge>`,
    heading: 'Panel heading',
    subtitle: 'Panel subtitle'
  }
};

export const WithPrefix: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<span>Panel content</span>`,
    prefix: () => html`<sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>`,
    suffix: () => html`<sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix</sl-badge>`,
    heading: 'Panel heading',
    subtitle: 'Panel subtitle'
  }
};

export const WithSuffix: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<span>Panel content</span>`,
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
      #root-inner,
      div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
      }

      section:first-of-type {
        background-color: var(--sl-elevation-surface-raised-alternative-idle);
      }
    </style>
    ${elevations.map(
      elevation => html`
        <h2>Elevation: ${elevation}</h2>
        <section>
          <div>
            <h3>No outline</h3>
            <sl-panel .elevation=${elevation} heading="Panel 1">Panel 1 content</sl-panel>
            <sl-panel .elevation=${elevation} heading="Panel 2">
              Panel 2 content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel .elevation=${elevation} collapsible heading="Panel 3">Panel 3 content</sl-panel>
            <sl-panel .elevation=${elevation} collapsible collapsed heading="Panel 4">
              Panel 4 content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel
              .elevation=${elevation}
              collapsible
              collapsed
              heading="Panel 5; Eu quis Lorem laboris veniam reprehenderit esse tempor fugiat."
            >
              Panel 5 content.
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel .elevation=${elevation} collapsible collapsed heading="Panel 6 with prefix">
              <sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>
              Panel 6 content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel .elevation=${elevation} collapsible collapsed heading="Panel 7 with suffix">
              <sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>
              Panel 7 content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
          </div>
          <div>
            <h3>Outline</h3>
            <sl-panel outline .elevation=${elevation} heading="Panel 1">Panel 1 content</sl-panel>
            <sl-panel outline .elevation=${elevation} heading="Panel 2">
              Panel 2 content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel outline .elevation=${elevation} collapsible heading="Panel 3">Panel 3 content</sl-panel>
            <sl-panel outline .elevation=${elevation} collapsible collapsed heading="Panel 4">
              Panel 4 content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel
              outline
              .elevation=${elevation}
              collapsible
              collapsed
              heading="Panel 5; Eu quis Lorem laboris veniam reprehenderit esse tempor fugiat."
            >
              Panel 5 content.
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel outline .elevation=${elevation} collapsible collapsed heading="Panel 6 with prefix">
              <sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>
              Panel 6 content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel outline .elevation=${elevation} collapsible collapsed heading="Panel 7 with suffix">
              <sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>
              Panel 7 content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
          </div>
        </section>
      `
    )}
  `
};

// TODO: problems with overflow, menu button is outside the panel
