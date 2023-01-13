import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Tabs'
};

export const API: StoryObj = {
  render: () => html`
    <sl-tabs>
      <sl-tab-bar>
        <sl-tab-button>Tab 1</sl-tab-button>
        <sl-tab-button>Tab 2</sl-tab-button>
        <sl-tab-button>Tab 3</sl-tab-button>
      </sl-tab-bar>
      <sl-tab>Contents tab 1</sl-tab>
      <sl-tab>Contents tab 2</sl-tab>
      <sl-tab>Contents tab 3</sl-tab>
    </sl-tabs>
  `
};
