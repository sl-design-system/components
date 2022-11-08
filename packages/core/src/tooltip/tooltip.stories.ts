import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { tooltip } from './tooltip-directive.js';
import './register.js';

export default {
  title: 'Tooltip'
};

export const API: StoryObj = {
  render: () => html`<span ${tooltip('Hello world')}>I have a tooltip</span>`
};
