import type { StoryObj } from '@storybook/web-components';
import { getPeople } from '@sanomalearning/example-data';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Sorting'
};

export const Single: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};
