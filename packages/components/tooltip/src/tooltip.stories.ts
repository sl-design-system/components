import '@sl-design-system/button/register.js';
import { type Meta } from '@storybook/web-components-vite';
import { LitElement, type TemplateResult, css, html, nothing } from 'lit';
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
    showHoverBridge: true,
    text: 'The hotpink area bridges the area between anchor and tooltip, making it possible to move the mouse from the anchor to the tooltip without it disappearing.'
  }
};

export const All = {
  args: {
    tooltip: () => html`
      <sl-tooltip for="button" open style="position-area: top">Top</sl-tooltip>
      <sl-tooltip for="button" open style="position-area: right">Right</sl-tooltip>
      <sl-tooltip for="button" open style="position-area: bottom">Bottom</sl-tooltip>
      <sl-tooltip for="button" open style="position-area: left">Left</sl-tooltip>
    `
  }
};

export const Custom = {
  render: () => {
    customElements.define(
      'x-demo',
      class extends LitElement {
        static override styles = css`
          button {
            anchor-name: --button;
          }

          div {
            background: var(--sl-elevation-surface-raised-inverted);
            border: 0;
            border-radius: var(--sl-size-borderRadius-default);
            box-sizing: border-box;
            color: var(--sl-color-foreground-inverted-plain);
            font-weight: var(--sl-text-new-typeset-fontWeight-regular);
            inset-block-start: calc(anchor(top) - var(--sl-size-100));
            inset-inline-start: calc(anchor(right) + var(--sl-size-100));
            margin: 0;
            padding: var(--sl-size-100) var(--sl-size-150);
            position-anchor: --button;
            position: fixed;
          }
        `;

        override render() {
          return html`
            <button>Anchor</button>
            <div>Tooltip</div>
          `;
        }
      }
    );

    return html`<x-demo></x-demo>`;
  }
};
