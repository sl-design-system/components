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
    message: 'Tooltip',
    position: 'bottom'
  },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    }
  },
  render: ({ message, position }) => html`
    <sl-button aria-describedby="tooltip">Button</sl-button>
    <sl-tooltip id="tooltip" .position=${position}>${message}</sl-tooltip>
  `
};

export const Directive: StoryObj = {
  render: () => html`<sl-button ${tooltip('This tooltip is from a directive')}>I have a tooltip</sl-button>`
};

export const Overflow: StoryObj = {
  render: () => html`
    <div style="overflow: hidden">
      <sl-button aria-describedby="tooltip">Button</sl-button>
      <sl-tooltip id="tooltip">This appears outside the overflow parent</sl-tooltip>
    </div>
  `
};

export const Shared: StoryObj = {
  render: () => html`
    <sl-button-bar>
      <sl-button aria-describedby="tooltip">We</sl-button>
      <sl-button aria-describedby="tooltip">all</sl-button>
      <sl-button aria-describedby="tooltip">share</sl-button>
      <sl-button aria-describedby="tooltip">the</sl-button>
      <sl-button aria-describedby="tooltip">same</sl-button>
      <sl-button aria-describedby="tooltip">tooltip</sl-button>
    </sl-button-bar>
    <sl-tooltip id="tooltip">I am shared between different elements</sl-tooltip>
  `
};
