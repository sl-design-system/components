import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Select'
};

export const API: StoryObj = {
  render: () => html`
    <sl-button>To focus</sl-button>
    <sl-select>
      <sl-select-option>😍 Option 1 </sl-select-option>
      <sl-select-option selected>🥸 Option 2 </sl-select-option>
      <sl-select-option>🤔 Option 3 </sl-select-option>
      <sl-select-option>😅 Option 4 </sl-select-option>
      <sl-select-option disabled>🤪 Option 5 </sl-select-option>
      <sl-select-option>🫣 Option 6 </sl-select-option>
    </sl-select>
    <sl-button>To focus</sl-button>
  `
};

export const CustomComponents: StoryObj = {
  render: () => html`
    <sl-button>To focus</sl-button>
    <sl-select>
      <sl-select-option><sl-avatar uniqueProfileId="1"></sl-avatar></sl-select-option>
      <sl-select-option selected><sl-avatar uniqueProfileId="2"></sl-avatar></sl-select-option>
      <sl-select-option><sl-avatar uniqueProfileId="3"></sl-avatar></sl-select-option>
      <sl-select-option><sl-avatar uniqueProfileId="14"></sl-avatar></sl-select-option>
      <sl-select-option disabled><sl-avatar uniqueProfileId="bla"></sl-avatar></sl-select-option>
      <sl-select-option><sl-avatar uniqueProfileId="xxs"></sl-avatar></sl-select-option>
    </sl-select>
    <sl-button>To focus</sl-button>
  `
};
