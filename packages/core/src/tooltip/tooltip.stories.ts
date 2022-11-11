import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { tooltip } from './tooltip-directive.js';
import '../button/register.js';
import './register.js';

export default {
  title: 'Tooltip'
};

export const API: StoryObj = {
  args: {
    position: 'bottom'
  },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    }
  },
  render: ({ position }) => html`
    <sl-button aria-describedby="tooltip">Button</sl-button>
    <sl-tooltip id="tooltip" .position=${position}>Tooltip</sl-tooltip>
  `
};

export const Directive: StoryObj = {
  render: () => html`<span ${tooltip('Hello world')}>I have a tooltip</span>`
};
