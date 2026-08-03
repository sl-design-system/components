import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Tooltip } from './tooltip.js';

type Props = Pick<Tooltip, 'disabled' | 'open' | 'type'> & {
  maxWidth: number;
  position: string;
  showHoverBridge: boolean;
  text: string;
  tooltip(): TemplateResult;
  trigger: string[];
};
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Tooltip',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    maxWidth: {
      control: 'number'
    },
    open: {
      control: 'boolean'
    },
    position: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    },
    showHoverBridge: {
      control: 'boolean'
    },
    text: {
      control: 'text'
    },
    tooltip: {
      table: { disable: true }
    },
    trigger: {
      control: 'inline-check',
      options: ['click', 'hover', 'focus', 'manual']
    },
    type: {
      control: 'inline-radio',
      options: ['description', 'label']
    }
  },
  args: {
    text: 'Tooltip text',
    type: 'description'
  },
  render: ({
    disabled,
    maxWidth,
    open,
    position,
    showHoverBridge,
    text,
    tooltip,
    trigger,
    type
  }) => html`
    <sl-button id="button">Anchor</sl-button>
    ${tooltip
      ? tooltip()
      : html`
          <sl-tooltip
            ?disabled=${disabled}
            ?open=${open}
            for="button"
            trigger=${ifDefined(trigger?.join(' ') || undefined)}
            type=${ifDefined(type)}>
            ${text}
          </sl-tooltip>
        `}
    <style>
      ${maxWidth ? `sl-tooltip { max-inline-size: ${maxWidth}px; }` : nothing}
      ${position ? `sl-tooltip { position-area: ${position} }` : nothing}
      ${showHoverBridge ? 'sl-tooltip::part(hover-bridge) { background: hotpink; }' : nothing}
    </style>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const ClickTrigger: Story = {
  args: {
    text: 'Click again to dismiss',
    trigger: ['click']
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const HoverBridge: Story = {
  args: {
    maxWidth: 200,
    showHoverBridge: true,
    text: 'The hotpink area bridges the area between anchor and tooltip, making it possible to move the mouse from the anchor to the tooltip without it disappearing.'
  }
};

export const Shared: Story = {
  args: {
    text: 'Works on the current selection'
  },
  render: ({ text, type }) => html`
    <sl-button-bar>
      <sl-button id="copy">Copy</sl-button>
      <sl-button id="cut">Cut</sl-button>
      <sl-button id="paste">Paste</sl-button>
    </sl-button-bar>
    <sl-tooltip for="copy cut paste" type=${ifDefined(type)}>${text}</sl-tooltip>
  `
};

export const All: Story = {
  render: () => html`
    <sl-button id="button">Anchor</sl-button>
    <sl-tooltip for="button" open style="position-area: top">Top</sl-tooltip>
    <sl-tooltip for="button" open style="position-area: right">Right</sl-tooltip>
    <sl-tooltip for="button" open style="position-area: bottom">Bottom</sl-tooltip>
    <sl-tooltip for="button" open style="position-area: left">Left</sl-tooltip>
  `
};
