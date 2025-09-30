import {
  faBackpack,
  faBook,
  faCopy,
  faGear,
  faLink,
  faList,
  faLock,
  faPaste,
  faPen,
  faShare,
  faTrash,
  faUnlock
} from '@fortawesome/pro-regular-svg-icons';
import { announce } from '@sl-design-system/announcer';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import { SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { LitElement, type TemplateResult, html } from 'lit';
import '../register.js';
import { type Panel, type PanelDensity, PanelElevation, type TogglePlacement } from './panel.js';

type Props = Pick<
  Panel,
  'collapsed' | 'collapsible' | 'density' | 'divider' | 'elevation' | 'heading' | 'noBorder' | 'togglePlacement'
> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
  prefix?(): string | TemplateResult;
  suffix?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

const densities: PanelDensity[] = ['plain', 'comfortable'];

const elevations: PanelElevation[] = ['none', 'raised', 'sunken'];

const togglePlacements: TogglePlacement[] = ['start', 'end'];

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

Icon.register(faBackpack, faBook, faCopy, faGear, faLink, faLock, faList, faPaste, faPen, faShare, faTrash, faUnlock);

export default {
  title: 'Layout/Panel',
  tags: ['draft'],
  args: {
    collapsible: false,
    density: 'plain',
    divider: false,
    elevation: 'none',
    noBorder: false,
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
    density: {
      control: 'radio',
      options: densities
    },
    elevation: {
      control: 'radio',
      options: elevations
    },
    prefix: {
      table: { disable: true }
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
    density,
    divider,
    elevation,
    heading,
    noBorder,
    prefix,
    suffix,
    togglePlacement
  }) => {
    return html`
      <sl-panel
        ?collapsed=${collapsible && collapsed}
        ?collapsible=${collapsible}
        ?divider=${divider}
        .density=${density}
        .elevation=${elevation}
        .heading=${heading}
        .noBorder=${noBorder}
        .togglePlacement=${togglePlacement}
      >
        ${actions?.()}${content?.()}${prefix?.()}${suffix?.()}
      </sl-panel>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    actions: () =>
      html`<sl-button fill="ghost" slot="actions" aria-label="Remove"><sl-icon name="far-trash"></sl-icon></sl-button>`,
    content: () => html`<span>Panel content</span>`,
    heading: 'Panel heading'
  }
};

export const WithPrefix: Story = {
  args: {
    actions: () =>
      html`<sl-button fill="ghost" slot="actions" aria-label="Remove"><sl-icon name="far-trash"></sl-icon></sl-button>`,
    content: () => html`<span>Panel content</span>`,
    prefix: () => html`<sl-icon slot="prefix" name="far-backpack"></sl-icon>`,
    heading: 'Panel heading'
  }
};

export const WithSuffix: Story = {
  args: {
    actions: () =>
      html`<sl-button fill="ghost" slot="actions" aria-label="Remove"><sl-icon name="far-trash"></sl-icon></sl-button>`,
    content: () => html`<span>Panel content</span>`,
    suffix: () => html`<sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix</sl-badge>`,
    heading: 'Panel heading'
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
      'Explore and Understand Our Amazing Planet: Simple and Fun Geography Lessons to Learn About Countries, Cultures, and the World Around Us. Let the journey begin.',
    content: () =>
      'Learn all about the Earth with easy and interactive geography lessons. Discover maps, explore different countries and their cultures, and understand how the world works. Take fun quizzes, track your progress, and enjoy interesting facts about our planet. Make geography exciting and simple with tools designed to help you learn and explore.'
  }
};

export const OverflowActions: Story = {
  args: {
    ...Basic.args,
    actions: () => html`
      <sl-button fill="ghost" slot="actions" aria-label="Edit"><sl-icon name="far-pen"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Copy"><sl-icon name="far-copy"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Paste"><sl-icon name="far-paste"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Book"><sl-icon name="far-book"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Share"><sl-icon name="far-share"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="List"><sl-icon name="far-list"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Link"><sl-icon name="far-link"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Lock"><sl-icon name="far-lock"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Unlock"><sl-icon name="far-unlock"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Settings"><sl-icon name="far-gear"></sl-icon></sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Remove"><sl-icon name="far-trash"></sl-icon></sl-button>
    `,
    content: () => "If you add too many actions that won't fit on 1 line, it will add a menu button for the overflow."
  }
};

export const ActionsWithTooltips: Story = {
  args: {
    ...Basic.args,
    actions: () => html`
      <sl-button aria-labelledby="edit-tooltip" fill="ghost" slot="actions">
        <sl-icon name="far-pen"></sl-icon>
      </sl-button>
      <sl-tooltip id="edit-tooltip">Edit</sl-tooltip>
      <sl-button aria-labelledby="copy-tooltip" fill="ghost" slot="actions">
        <sl-icon name="far-copy"></sl-icon>
      </sl-button>
      <sl-tooltip id="copy-tooltip">Copy</sl-tooltip>
      <sl-button aria-labelledby="paste-tooltip" fill="ghost" slot="actions">
        <sl-icon name="far-paste"></sl-icon>
      </sl-button>
      <sl-tooltip id="paste-tooltip">Paste</sl-tooltip>
      <sl-button aria-labelledby="share-tooltip" fill="ghost" slot="actions">
        <sl-icon name="far-share"></sl-icon>
      </sl-button>
      <sl-tooltip id="share-tooltip">Paste</sl-tooltip>
    `,
    content: () => 'This panel contains action buttons with tooltips.'
  }
};

export const FixedInlineSize: Story = {
  args: {
    ...Basic.args,
    actions: () => html`
      <sl-button fill="ghost" slot="actions" aria-label="Copy">
        <sl-icon name="far-copy"></sl-icon>
      </sl-button>
      <sl-button fill="ghost" slot="actions" aria-label="Book">
        <sl-icon name="far-book"> </sl-icon>
      </sl-button>
    `,
    content: () => html`
      <style>
        sl-panel {
          inline-size: 350px;
        }
      </style>

      This is a panel with a fixed inline size of 350px.
    `
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
        sl-panel {
          --sl-panel-content-padding: 0;
        }

        th {
          text-align: left;
        }

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

      <table class="flex-table">
        <tbody>
          <tr class="row">
            <th class="cell">Name</th>
            <th class="cell">Days</th>
            <th class="cell">Since</th>
            <th class="cell">Signal</th>
          </tr>
          ${Array.from({ length: 6 }).map(
            (_, rowIndex) => html`
              <tr class="row">
                <td class="cell">
                  <sl-avatar
                    .displayName=${users[rowIndex].name}
                    .pictureUrl=${users[rowIndex].picture}
                    size="md"
                  ></sl-avatar>
                </td>
                <td class="cell">${users[rowIndex].days}</td>
                <td class="cell">${users[rowIndex].since}</td>
                <td class="cell">
                  <sl-badge emphasis="subtle" size="lg" variant="info">${users[rowIndex].signal}</sl-badge>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `,
    heading: 'Absence'
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
          max-height: 40rem;
          aspect-ratio: 3 / 4;
        }
      </style>
      <div>
        <span>Panel without header. Panel content - can contain anything you need.</span>
        <img alt="city" src="https://images.unsplash.com/photo-1586622992874-27d98f198139" />
      </div>
    `
  }
};

export const ToggleExternally: Story = {
  render: () => {
    try {
      customElements.define(
        'panel-toggle-example',
        class extends LitElement {
          panel = true;

          override render(): TemplateResult {
            return html`
              <h2>We use the announcer to inform the user, when the accordion is opened/closed externally.</h2>
              <sl-button @click=${this.togglePanel}>Toggle panel</sl-button>
              <p>State: ${this.panel ? 'open' : 'closed'}</p>
              <sl-panel
                @sl-toggle=${(e: SlToggleEvent) => this.onToggle(e)}
                .collapsed=${!this.panel}
                collapsible
                heading="Discovering Dinosaurs 🦕"
              >
                Embark on a thrilling journey back in time to the age of dinosaurs, where colossal creatures roamed the
                Earth 🌎 and ancient landscapes teemed with life. This prehistoric adventure invites you to explore a
                world untouched by modern civilization, filled with towering ferns 🌿, volcanic mountains, and the
                thunderous footsteps of giants like the Tyrannosaurus rex 🦖 and the Triceratops. Whether you're
                navigating dense jungles or witnessing dramatic encounters between predator and prey, every moment is
                packed with excitement and discovery. Get ready to uncover the mysteries of a lost era and experience
                the awe-inspiring power of nature in its most primal form.
              </sl-panel>
            `;
          }

          togglePanel() {
            this.panel = !this.panel;
            announce(`Panel ${this.panel ? 'expanded' : 'collapsed'}`);
            this.requestUpdate();
          }

          //make sure that the state of the panel is updated in the current component when it's changed in the SLDS panel component
          onToggle(event: SlToggleEvent) {
            this.panel = event.detail as boolean;
            this.requestUpdate();
          }
        }
      );
    } catch {
      /* empty */
    }

    return html`<panel-toggle-example></panel-toggle-example>`;
  }
};

export const All: Story = {
  render: () => html`
    <style>
      sl-panel.examples::part(content) {
        display: grid;
        grid-template-columns: minmax(auto, 500px);
        gap: 1rem;
        padding: 1.5rem;
      }

      sl-panel.examples {
        inline-size: fit-content;
      }

      h3 {
        margin: 0;
      }
    </style>

    <section>
      <sl-panel no-border elevation="raised" class="examples">
        <h3>Static panel</h3>
        Static panels group content and layout sections.
        <sl-panel> A layout without a header, typically used for content grouping. </sl-panel>
        <sl-panel heading="A static panel with a header">
          A static layout with a header to provide more context to the content.
        </sl-panel>

        <h3>Collapsible panel</h3>
        Collapsible panels allow users to expand or collapse sections of content.
        <sl-panel collapsible heading="Toggle start">
          A collapsible panel with the toggle positioned at the beginning of the section.
        </sl-panel>
        <sl-panel collapsible heading="Toggle end" toggle-placement="end">
          A collapsible panel with the toggle placed at the end of the section.
        </sl-panel>

        <h3>Elevation</h3>
        Elevation controls how the panel visually sits within the layout, from flat to raised.
        <sl-panel heading="None">
          For nested panels or areas where no visual background or separation is needed.
        </sl-panel>
        <sl-panel elevation="raised" heading="Raised">
          Adds elevation to visually lift the panel from the surrounding content. Use when the panel is placed on top of
          the page body.
        </sl-panel>
        <sl-panel elevation="sunken" heading="Sunken">
          Adds a subtle inset effect. Useful for grouping nested content within a panel.
        </sl-panel>

        <h3>Density</h3>
        Density adjusts the internal spacing of content within the panel.
        <sl-panel heading="Plain"> The default spacing for general use. </sl-panel>
        <sl-panel density="comfortable" heading="Comfortable"> Adds extra padding for a more relaxed layout. </sl-panel>

        <h3>Divider</h3>
        Dividers can be added to visually separate sections within a panel.
        <sl-panel heading="Without divider"> Use when visual separation is not needed between sections. </sl-panel>
        <sl-panel divider heading="With divider">
          Adds a horizontal divider to separate content areas clearly.
        </sl-panel>

        <h3>No border</h3>
        By default, there is a border around the panel. This can be removed by setting the no-border attribute.
        <sl-panel heading="With border"> A border around the panel to make it more distinct in the layout. </sl-panel>
        <sl-panel no-border heading="No border">
          Best used when elevation or other context provides sufficient separation.
        </sl-panel>
      </sl-panel>
    </section>
  `
};
