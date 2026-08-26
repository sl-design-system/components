import { faGear, faPen } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import './register.js';

Icon.register(faGear, faPen);

type Props = {
  alignSelf: string;
  body: string | (() => TemplateResult);
  maxWidth: number;
  noDescribedby: boolean;
  justifySelf: string;
  positionArea: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Popover',
  args: {
    alignSelf: 'center',
    body: "I'm a popover example",
    justifySelf: 'center'
  },
  argTypes: {
    alignSelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    body: {
      table: { disable: true }
    },
    maxWidth: {
      control: 'number'
    },
    justifySelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    positionArea: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    }
  },
  render: ({ alignSelf, justifySelf, body, maxWidth, positionArea, noDescribedby }) => {
    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(100dvh - 2rem);
          place-items: center;
        }
        sl-popover {
          max-inline-size: ${maxWidth ? `${maxWidth}px` : 'auto'};
        }
      </style>
      <sl-button
        command="toggle-popover"
        commandfor="popover"
        style=${styleMap({ alignSelf, justifySelf })}>
        Toggle
      </sl-button>
      <sl-popover id="popover" ?no-describedby=${noDescribedby} style=${styleMap({ positionArea })}>
        ${typeof body === 'string' ? body : body()}
      </sl-popover>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    maxWidth: 400,
    body: () => html`
      <header style="font:var(--sl-text-new-heading-sm);">Hello! I am a popover!</header>
      <section>
        <p>
          I'm a lightweight and flexible UI element that appears on top of other content. I am often
          used to display additional information, actions, or contextual content without disrupting
          the main flow of the interface.
        </p>
      </section>
      <sl-button command="hide-popover" commandfor="popover" variant="primary">Close</sl-button>
    `
  }
};

export const NoDescribedBy: Story = {
  args: {
    maxWidth: 400,
    noDescribedby: true,
    body: () => {
      return html`
        A popover with plain text content describes the button that opens it: the popover sets
        aria-describedby on that button, and a screen reader reads this whole text out as its
        description. That works for a sentence or two, but a description is announced in one go,
        with no way to pause it, skim it, or move through it. For a body this long that gets in the
        way rather than helping. Setting no-describedby leaves the description off and keeps only
        aria-details, which tells assistive technology that there is more to read here and lets the
        user navigate to it when they are ready.
      `;
    }
  }
};

export const VerticalOverflow: Story = {
  args: {
    body: () => {
      return html`
        <style>
          .wrapper {
            background: var(--sl-color-background-accent-green-subtlest);
            block-size: 50dvh;
            padding-inline: var(--sl-size-200);
            place-content: center;
          }
        </style>
        <div class="wrapper">Block</div>
      `;
    }
  }
};

export const RichContent: Story = {
  args: {
    body: () => {
      const onClick = (): void => {
        return;
      };

      return html`
        <style>
          section {
            margin: 16px 0;
          }
          sl-popover {
            max-width: 300px;
          }
        </style>
        <header>
          <sl-avatar
            display-name="Yousef van der Schaaf"
            picture-url="https://randomuser.me/api/portraits/thumb/men/19.jpg"></sl-avatar>
        </header>
        <section>
          <p>
            Our longest serving math teacher, but also responsible for several extracurricular
            activities.
          </p>
          <p>
            <strong>Manager:</strong>
            Anna Johansson
          </p>
        </section>
        <sl-button-bar align="end">
          <sl-button @click=${onClick} size="sm" variant="primary" fill="outline">
            Send email
          </sl-button>
          <sl-button @click=${onClick} size="sm" variant="primary">Send Slack message</sl-button>
        </sl-button-bar>
      `;
    }
  }
};

export const WithTooltips: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            /**
             * The rule is disabled for icon-only sl-buttons because they use ariaLabelledByElements
             * to set aria-labelledby across shadow DOM boundaries, which the a11y checker cannot
             * detect.
             */
            id: 'button-name',
            enabled: false,
            selector: 'sl-button[icon-only]'
          }
        ]
      }
    }
  },
  render: () => {
    return html`
      <style>
        .container {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }
      </style>
      <p>
        Buttons with popovers and tooltips connected via
        <code>aria-labelledby</code>
      </p>
      <div class="container">
        <sl-button
          aria-labelledby="tooltip-settings"
          command="toggle-popover"
          commandfor="popover-settings"
          tooltip="Settings"
          variant="primary">
          <sl-icon name="far-gear"></sl-icon>
        </sl-button>
        <sl-popover id="popover-settings">Popover content for Settings</sl-popover>

        <sl-button
          aria-labelledby="tooltip-edit"
          command="toggle-popover"
          commandfor="popover-edit"
          size="lg"
          tooltip="Edit"
          variant="primary">
          <sl-icon name="far-pen"></sl-icon>
        </sl-button>
        <sl-popover id="popover-edit">Popover content for Edit</sl-popover>
      </div>

      <p>
        Buttons with popovers and tooltips connected via
        <code>aria-describedby</code>
      </p>
      <div class="container">
        <sl-button
          command="toggle-popover"
          commandfor="popover-settings-1"
          tooltip="Open settings popover"
          variant="primary">
          <sl-icon name="far-gear"></sl-icon>
          Settings
        </sl-button>
        <sl-popover id="popover-settings-1">Popover content for Settings</sl-popover>

        <sl-button
          command="toggle-popover"
          commandfor="popover-edit-1"
          size="lg"
          tooltip="Open edit popover"
          variant="primary">
          <sl-icon name="far-pen"></sl-icon>
          Edit
        </sl-button>
        <sl-popover id="popover-edit-1">Popover content for Edit</sl-popover>
      </div>
    `;
  }
};

export const All: Story = {
  parameters: {
    layout: 'centered'
  },
  render: () => {
    // There is no invoker here, so every popover is opened against the button programmatically.
    setTimeout(() => {
      const anchor = document.querySelector('sl-button') as HTMLElement;

      document
        .querySelectorAll('sl-popover')
        .forEach(popover => popover.showPopover({ source: anchor }));
    });

    return html`
      <sl-button>Anchor</sl-button>
      <sl-popover popover="manual" style="position-area: top">Top</sl-popover>
      <sl-popover popover="manual" style="position-area: right">Right</sl-popover>
      <sl-popover popover="manual" style="position-area: bottom">Bottom</sl-popover>
      <sl-popover popover="manual" style="position-area: left">Left</sl-popover>
    `;
  }
};
