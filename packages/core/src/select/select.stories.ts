import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Select'
};

export const API: StoryObj = {
  render: () => html`
    <sl-select>
      <sl-select-option>😍 Option 1 </sl-select-option>
      <sl-select-option selected>🥸 Option 2 </sl-select-option>
      <sl-select-option>🤔 Option 3 </sl-select-option>
      <sl-select-option>😅 Option 4 </sl-select-option>
      <sl-select-option disabled>🤪 Option 5 </sl-select-option>
      <sl-select-option>🫣 Option 6 </sl-select-option>
    </sl-select>
  `
};
