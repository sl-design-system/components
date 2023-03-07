import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Icon'
};

export const API: StoryObj = {
  render: () => html`<sl-icon name="star"></sl-icon><sl-icon name="check"></sl-icon>`
};
