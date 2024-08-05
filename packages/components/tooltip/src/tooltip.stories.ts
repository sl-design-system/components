import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/spinner/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { tooltip } from './tooltip-directive.js';
import { type Tooltip } from './tooltip.js';

type Props = Pick<Tooltip, 'maxWidth' | 'position'> & {
  alignSelf: string;
  justifySelf: string;
  example?(props: Props): TemplateResult;
  message: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Tooltip',
  tags: ['stable'],
  args: {
    alignSelf: 'center',
    justifySelf: 'center',
    maxWidth: 160,
    message: 'This is the tooltip message',
    position: 'top'
  },
  argTypes: {
    alignSelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    example: {
      table: { disable: true }
    },
    justifySelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    position: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end'
      ]
    }
  },
  render: props => {
    const { alignSelf, example, justifySelf, message, position, maxWidth } = props;

    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(100dvh - 2rem);
          place-items: center;
        }
      </style>
      ${example
        ? example?.(props)
        : html`
            <sl-button
              aria-describedby="tooltip"
              style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}
            >
              Button
            </sl-button>
            <sl-tooltip id="tooltip" .position=${position} .maxWidth=${maxWidth}>${message}</sl-tooltip>
          `}
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Directive: Story = {
  args: {
    example: ({ alignSelf, justifySelf, message }) => html`
      <sl-button ${tooltip(message)} style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}>
        Button
      </sl-button>
    `
  }
};

export const Shared: Story = {
  args: {
    example: ({ alignSelf, justifySelf, message }) => html`
      <sl-button-bar style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}>
        <sl-button aria-describedby="tooltip" fill="outline"><sl-spinner></sl-spinner> We</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">all</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">share</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">the</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">same</sl-button>
        <sl-button aria-describedby="tooltip" fill="outline">tooltip</sl-button>
      </sl-button-bar>
      <sl-tooltip id="tooltip">${message}</sl-tooltip>
    `
  },
  parameters: {
    // Notifies Chromatic to pause the animations at the first frame for this specific story.
    chromatic: { pauseAnimationAtEnd: false, prefersReducedMotion: 'reduce' }
  }
};

export const All: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelectorAll('sl-button').forEach(button => {
        button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      });
    });
    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(20rem);
          place-items: center;
        }
      </style>
      <sl-button aria-describedby="tooltip"> Button </sl-button>
      <sl-tooltip id="tooltip" position="top" max-width="300">This is the tooltip message</sl-tooltip>
    `;
  }
};
