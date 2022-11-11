import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button/register.js';
import './register.js';

export default {
  title: 'Popover',
  parameters: {
    layout: 'centered'
  }
};

export const API: StoryObj = {
  render: () => html`
    <sl-button>Toggle popover</sl-button>
    <sl-popover>I'm a popover</sl-popover>
  `
};
