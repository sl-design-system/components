import { getPeople } from '@sl-design-system/example-data';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Editing',
  loaders: [async () => ({ people: (await getPeople()).people })]
} satisfies Meta;

export const TextField: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-text-field-column path="address.zip"></sl-grid-text-field-column>
    </sl-grid>
  `
};

export const Select: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-select-column .options=${['Available', 'Busy']} path="status"></sl-grid-select-column>
    </sl-grid>
  `
};
