import type { StoryObj } from '@storybook/web-components';
import { getPeople } from '@sanomalearning/example-data';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Filtering'
};

export const PerColumn: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-filter-column path="firstName"></sl-grid-filter-column>
      <sl-grid-filter-column path="lastName"></sl-grid-filter-column>
      <sl-grid-filter-column path="email"></sl-grid-filter-column>
      <sl-grid-filter-column path="profession"></sl-grid-filter-column>
    </sl-grid>
  `
};
