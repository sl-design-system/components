import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Tab Group'
};

export const API: StoryObj = {
  render: () => html`
    <sl-tab-group>
      <sl-tab slot="tabs">Tab 1</sl-tab>
      <sl-tab-panel>Contents tab 1</sl-tab-panel>

      <sl-tab slot="tabs">Tab 2</sl-tab>
      <sl-tab-panel>Contents tab 2</sl-tab-panel>

      <sl-tab slot="tabs" selected>Tab 3</sl-tab>
      <sl-tab-panel>Contents tab 3</sl-tab-panel>
    </sl-tab-group>
  `
};
