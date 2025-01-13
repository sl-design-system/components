import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Panel, PanelElevation, type SubtitlePlacement, type TogglePlacement } from './panel.js';

type Props = Pick<
  Panel,
  | 'collapsed'
  | 'collapsible'
  | 'elevation'
  | 'heading'
  | 'noPadding'
  | 'outline'
  | 'subheading'
  | 'subtitlePlacement'
  | 'togglePlacement'
> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
  prefix?(): string | TemplateResult;
  suffix?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

const togglePlacements: TogglePlacement[] = ['start', 'end'];

const placements: SubtitlePlacement[] = ['bottom', 'top'];

const elevations: PanelElevation[] = ['none', 'raised', 'sunken'];

const users: Array<{ name: string; picture?: string; days: number; since: string; signal: string }> = [
  {
    name: 'Yousef van der Schaaf',
    picture: 'https://randomuser.me/api/portraits/mendfgdfgdfdfg/81.jpg',
    days: 7,
    since: '2021-01-01',
    signal: 'long-term'
  },
  {
    name: 'Chester Reid',
    picture: 'https://randomuser.me/api/portraits/men/19.jpg',
    days: 2,
    since: '2021-01-06',
    signal: 'no data'
  },
  {
    name: 'Emma Henderson - Van Deursen',
    picture: 'https://randomuser.me/api/portraits/women/19.jpg',
    days: 1,
    since: '2021-01-07',
    signal: 'no data'
  },
  {
    name: 'Johnni Sullivan',
    days: 1,
    since: '2021-01-07',
    signal: 'long-term'
  },
  {
    name: 'Gustav Christensen',
    days: 3,
    since: '2021-01-05',
    signal: 'no data'
  },
  {
    name: 'Rose Nylund',
    picture: 'https://randomuser.me/api/portraits/women/10.jpg',
    days: 10,
    since: '2020-12-29',
    signal: 'no data'
  }
];

export default {
  title: 'Layout/Panel',
  tags: ['draft'],
  args: {
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
    collapsed,
    collapsible,
    content,
    elevation,
    heading,
    noPadding,
    outline,
    prefix,
    subheading,
    subtitlePlacement,
    suffix,
    togglePlacement
  }) => {
    return html`
      <sl-panel
        ?collapsed=${collapsible && collapsed}
        ?collapsible=${collapsible}
        .heading=${heading}
        .elevation=${elevation}
        .noPadding=${noPadding}
        .outline=${outline}
        .subheading=${subheading}
        .subtitlePlacement=${subtitlePlacement}
        .togglePlacement=${togglePlacement}
      >
        ${actions?.()}${content?.()}${prefix?.()}${suffix?.()}
      </sl-panel>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<span>Panel content</span>`,
    heading: 'Panel heading',
    subheading: 'Panel subheading'
  }
};

export const WithPrefix: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<span>Panel content</span>`,
    prefix: () => html`<sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>`,
    heading: 'Panel heading',
    subheading: 'Panel subheading'
  }
};

export const WithSuffix: Story = {
  args: {
    actions: () => html`<sl-button fill="outline" slot="actions">Remove</sl-button>`,
    content: () => html`<span>Panel content</span>`,
    suffix: () => html`<sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix</sl-badge>`,
    heading: 'Panel heading',
    subheading: 'Panel subheading'
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
    subheading:
      'Panel subheading. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt.',
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

export const NoPaddingContent: Story = {
  args: {
    collapsible: true,
    collapsed: true,
    content: () => html`
      <style>
        .flex-table {
          display: flex;
          flex-direction: column;
        }

        .row {
          display: flex;
        }

        .row:first-of-type {
          .cell {
            padding: 16px;
            font-weight: 600;
            font-size: 1.1em;
          }
        }

        .cell {
          flex: 1;
          border-top: 1px solid #ccc;
          padding: 8px 16px;
          align-content: center;
        }
      </style>

      <div>
        <div class="flex-table">
          <div class="row">
            <div class="cell">Name</div>
            <div class="cell">Days</div>
            <div class="cell">Since</div>
            <div class="cell">Signal</div>
          </div>
          ${Array.from({ length: 6 }).map(
            (_, rowIndex) => html`
              <div class="row">
                <div class="cell">
                  <sl-avatar
                    .displayName=${users[rowIndex].name}
                    .pictureUrl=${users[rowIndex].picture}
                    size="md"
                  ></sl-avatar>
                </div>
                <div class="cell">${users[rowIndex].days}</div>
                <div class="cell">${users[rowIndex].since}</div>
                <div class="cell">
                  <sl-badge emphasis="subtle" size="lg" variant="info">${users[rowIndex].signal}</sl-badge>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `,
    heading: 'Absence',
    noPadding: true
  }
};

export const NoHeader: Story = {
  args: {
    content: () => html`
      <style>
        div {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: start;
        }

        img {
          width: 40rem;
          height: 40rem;
        }
      </style>
      <div>
        <span>Panel without header. Panel content - can contain anything you need.</span>
        <img alt="city" src="https://images.unsplash.com/photo-1586622992874-27d98f198139" />
      </div>
    `
  }
};

export const CustomHeading: Story = {
  render: ({ elevation }) => html`
    <style>
      #root-inner,
      div {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        inline-size: 100%;
      }

      .examples {
        gap: 1.62rem;
      }

      section {
        display: flex;
        gap: 3rem;
        align-items: start;
        padding: 1rem;
      }

      section:first-of-type {
        background-color: var(--sl-elevation-surface-raised-alternative-idle);
      }

      .my-heading {
        font-size: 1.3rem;
        font-weight: 600;
        gap: 16px;
      }

      .badges {
        flex-direction: row;
        gap: 8px;
      }
    </style>
    <h2>Custom, slotted heading</h2>
    <section>
      <div class="examples">
        <sl-panel
          .elevation=${elevation}
          subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque."
        >
          <div class="my-heading" slot="heading">
            <div class="badges">
              <sl-badge emphasis="subtle" size="lg" variant="info">badge</sl-badge>
              <sl-badge emphasis="subtle" size="lg" variant="danger">badge</sl-badge>
            </div>
            Custom, slotted heading
          </div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce
          faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt.
          <sl-button fill="outline" slot="actions">Action</sl-button>
          <sl-button fill="outline" slot="actions">Action</sl-button>
          <sl-button fill="outline" slot="actions">Action</sl-button>
        </sl-panel>
        <sl-panel
          .elevation=${elevation}
          collapsible
          collapsed
          subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque."
        >
          <div class="my-heading" slot="heading">
            <div class="badges">
              <sl-badge emphasis="subtle" size="lg" variant="info">badge</sl-badge>
              <sl-badge emphasis="subtle" size="lg" variant="danger">badge</sl-badge>
            </div>
            Custom, slotted heading (collapsible)
          </div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce
          faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt.
          <sl-button fill="outline" slot="actions">Action</sl-button>
          <sl-button fill="outline" slot="actions">Action</sl-button>
          <sl-button fill="outline" slot="actions">Action</sl-button>
        </sl-panel>
      </div>
    </section>
  `
};

export const All: Story = {
  render: () => html`
    <style>
      #root-inner,
      div {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .examples {
        gap: 1.62rem;
      }

      section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
        padding: 1rem;
      }

      section:first-of-type {
        background-color: var(--sl-elevation-surface-raised-alternative-idle);
      }

      .my-heading {
        font-size: 1.3rem;
        font-weight: 600;
        gap: 16px;
      }

      .badges {
        flex-direction: row;
        gap: 8px;
      }
    </style>
    ${elevations.map(
      elevation => html`
        <h2>Elevation: ${elevation}</h2>
        <section>
          <div class="examples">
            <h3>No outline</h3>
            <sl-panel .elevation=${elevation}>Panel without header that can contain anything.</sl-panel>
            <sl-panel .elevation=${elevation} heading="Panel heading">Panel content</sl-panel>
            <sl-panel .elevation=${elevation} heading="Panel heading" subheading="Panel subheading"
              >Panel content</sl-panel
            >
            <sl-panel .elevation=${elevation} heading="Panel heading">
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel .elevation=${elevation} collapsible heading="Panel heading">Panel content</sl-panel>
            <sl-panel
              .elevation=${elevation}
              collapsible
              heading="Panel heading - toggle on the right"
              toggle-placement="end"
              >Panel content</sl-panel
            >
            <sl-panel .elevation=${elevation} collapsible collapsed heading="Panel heading">
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel
              .elevation=${elevation}
              collapsible
              collapsed
              heading="Panel heading - toggle on the right"
              toggle-placement="end"
            >
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel
              .elevation=${elevation}
              collapsible
              collapsed
              heading="Eu quis Lorem laboris veniam reprehenderit esse tempor fugiat."
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce
              faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt.
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel .elevation=${elevation} collapsible collapsed heading="Panel heading with prefix">
              <sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel .elevation=${elevation} collapsible collapsed heading="Panel heading with suffix">
              <sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix</sl-badge>
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel
              .elevation=${elevation}
              heading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. "
              subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. "
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce
              faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt.
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
          </div>
          <div>
            <h3>Outline</h3>
            <sl-panel outline .elevation=${elevation}>Panel content without header</sl-panel>
            <sl-panel outline .elevation=${elevation} heading="Panel heading">Panel content</sl-panel>
            <sl-panel outline .elevation=${elevation} heading="Panel heading" subheading="Panel subheading"
              >Panel content</sl-panel
            >
            <sl-panel outline .elevation=${elevation} heading="Panel heading">
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel outline .elevation=${elevation} collapsible heading="Panel heading">Panel content</sl-panel>
            <sl-panel
              outline
              .elevation=${elevation}
              collapsible
              heading="Panel heading - toggle on the right"
              toggle-placement="end"
              >Panel content</sl-panel
            >
            <sl-panel outline .elevation=${elevation} collapsible collapsed heading="Panel heading">
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel
              outline
              .elevation=${elevation}
              collapsible
              collapsed
              heading="Panel heading - toggle on the right"
              toggle-placement="end"
            >
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel
              outline
              .elevation=${elevation}
              collapsible
              collapsed
              heading=" Eu quis Lorem laboris veniam reprehenderit esse tempor fugiat."
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce
              faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt.
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel outline .elevation=${elevation} collapsible collapsed heading="Panel heading with prefix">
              <sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix</sl-badge>
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel outline .elevation=${elevation} collapsible collapsed heading="Panel heading with suffix">
              <sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix</sl-badge>
              Panel content
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
            <sl-panel
              outline
              .elevation=${elevation}
              heading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque."
              subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque."
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce
              faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt.
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
              <sl-button fill="outline" slot="actions">Action</sl-button>
            </sl-panel>
          </div>
        </section>
      `
    )}
  `
};
