import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Icon'
};

export const API: StoryObj = {
  render: () => html`
    <sl-icon name="star" size="sm"></sl-icon>
    <sl-icon name="star" size="md"></sl-icon>
    <sl-icon name="star" size="lg"></sl-icon>
    <sl-icon name="check" size="sm"></sl-icon>
    <sl-icon name="check" size="md"></sl-icon>
    <sl-icon name="check" size="lg"></sl-icon>
  `
};
