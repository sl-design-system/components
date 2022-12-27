import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../input/register.js';
import './register.js';

export default {
  title: 'Label'
};

export const API: StoryObj = {
  args: {
    required: false,
    text: 'Label text'
  },
  render: ({ required, text }) => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    </style>
    <div>
      <sl-label for="input">${text}</sl-label>
      <sl-input ?required=${required} id="input"></sl-input>
    </div>
  `
};
