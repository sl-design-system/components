import { getPeople } from '@sanomalearning/storybook-demo-data';
import { Story } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Grid'
};

export const API: Story = {
  loaders: [
    async () => ({ people: await getPeople() })
  ],
  render: (args, { loaded: { people }}) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};
