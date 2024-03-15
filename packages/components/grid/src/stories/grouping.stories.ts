import { getPeople } from '@sl-design-system/example-data';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Grouping'
};

export const Basic: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    return html`
      <sl-grid items-group-by="membership" .items=${people}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};
