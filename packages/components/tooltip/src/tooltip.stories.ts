import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { html } from 'lit';
import { tooltip } from './tooltip-directive.js';
import '../register.js';

export default {
  title: 'Tooltip',
  parameters: {
    layout: 'centered'
  }
};

export const API: StoryObj = {
  args: {
    message: 'Tooltip message',
    position: 'top',
    maxWidth: 150
  },
  argTypes: {
    position: {
      control: 'inline-radio',
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
  render: ({ message, position, maxWidth }) => {
    return html`
      <sl-button aria-describedby="tooltip" fill="outline">Button element</sl-button>
      <sl-tooltip id="tooltip" .position=${position} .maxWidth=${maxWidth}>${message}</sl-tooltip>
    `;
  }
};

export const Directive: StoryObj = {
  render: () =>
    html`<sl-button ${tooltip('This tooltip is from a directive')} fill="outline">I have a tooltip</sl-button>`
};

export const Overflow: StoryObj = {
  render: () => html`
    <div style="overflow: hidden">
      <sl-button aria-describedby="tooltip" fill="outline">Button</sl-button>
      <sl-tooltip id="tooltip">This appears outside the overflow parent</sl-tooltip>
    </div>
  `
};

export const Shared: StoryObj = {
  render: () => html`
    <sl-button-bar>
      <sl-button aria-describedby="tooltip" fill="outline">We</sl-button>
      <sl-button aria-describedby="tooltip" fill="outline">all</sl-button>
      <sl-button aria-describedby="tooltip" fill="outline">share</sl-button>
      <sl-button aria-describedby="tooltip" fill="outline">the</sl-button>
      <sl-button aria-describedby="tooltip" fill="outline">same</sl-button>
      <sl-button aria-describedby="tooltip" fill="outline">tooltip</sl-button>
    </sl-button-bar>
    <sl-tooltip id="tooltip">I am shared between different elements</sl-tooltip>
  `
};
