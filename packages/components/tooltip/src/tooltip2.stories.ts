import '@sl-design-system/button/register.js';
import { Meta } from '@storybook/web-components-vite';
import { TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Tooltip2 } from './tooltip2.js';

type Props = Pick<Tooltip2, 'disabled' | 'open'> & {
  maxWidth: number;
  position: string;
  showHoverBridge: boolean;
  text: string;
  tooltip(): TemplateResult;
  trigger: string[];
};

try {
  customElements.define('sl-tooltip2', Tooltip2);
} catch {
  /* empty */
}

export default {
  title: 'Overlay/Tooltip2',
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
    }
  },
  args: {
    text: 'Tooltip text'
  },
  render: ({ disabled, maxWidth, open, position, showHoverBridge, text, tooltip, trigger }) => html`
    <sl-button id="button">Anchor</sl-button>
    ${tooltip
      ? tooltip()
      : html`
          <sl-tooltip2
            ?disabled=${disabled}
            ?open=${open}
            for="button"
            trigger=${ifDefined(trigger?.join(' ') || undefined)}>
            ${text}
          </sl-tooltip2>
        `}
    <style>
      ${maxWidth ? `sl-tooltip2 { max-inline-size: ${maxWidth}px; }` : nothing}
      ${position ? `sl-tooltip2 { position-area: ${position} }` : nothing}
      ${showHoverBridge ? 'sl-tooltip2::part(hover-bridge) { background: hotpink; }' : nothing}
    </style>
  `
} satisfies Meta<Props>;

export const Basic = {};

export const ClickTrigger = {
  args: {
    text: 'Click again to dismiss',
    trigger: ['click']
  }
};

export const Disabled = {
  args: {
    disabled: true
  }
};

export const HoverBridge = {
  args: {
    maxWidth: 200,
    showHoverExtender: true,
    text: 'The hotpink area bridges the area between anchor and tooltip, making it possible to move the mouse from the anchor to the tooltip without it disappearing.'
  }
};

export const Positions = {
  args: {
    tooltip: () => html`
      <sl-tooltip2 for="button" open style="position-area: top">Top</sl-tooltip2>
      <sl-tooltip2 for="button" open style="position-area: right">Right</sl-tooltip2>
      <sl-tooltip2 for="button" open style="position-area: bottom">Bottom</sl-tooltip2>
      <sl-tooltip2 for="button" open style="position-area: left">Left</sl-tooltip2>
    `
  }
};
