import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { tooltip } from './tooltip-directive.js';
import '../button/register.js';
import './register.js';

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
