import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import '../button/register.js';
import './register.js';

export default {
  title: 'Popover',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left']
    }
  }
};

export const API: StoryObj = {
  args: {
    placement: 'top'
  },
  render: ({ placement }) => html`
    <sl-button id="button">Toggle popover</sl-button>
    <sl-popover anchor="button" placement=${ifDefined(placement)}>I'm a popover</sl-popover>
  `
};
