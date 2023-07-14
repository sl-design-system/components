import type { Grid } from '../grid.js';
import type { Person } from '@sl-design-system/example-data';
import type { TextInput } from '@sl-design-system/text-input';
import type { Meta, StoryObj } from '@storybook/web-components';
import { getPeople } from '@sl-design-system/example-data';
import '@sl-design-system/text-input/register.js';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Filtering',
  loaders: [async () => ({ people: (await getPeople()).people })]
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-filter-column mode="text" path="profession"></sl-grid-filter-column>
      <sl-grid-filter-column path="status"></sl-grid-filter-column>
      <sl-grid-filter-column path="membership"></sl-grid-filter-column>
    </sl-grid>
  `
};

export const Filtered: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-filter-column mode="text" path="profession" value="Endo"></sl-grid-filter-column>
      <sl-grid-filter-column path="status" value="Available"></sl-grid-filter-column>
      <sl-grid-filter-column path="membership" value="Regular,Premium"></sl-grid-filter-column>
    </sl-grid>
  `
};

export const EmptyValues: Story = {
  render: () => {
    const items = [
      { key: 'Foo', value: 'foo' },
      { key: 'Space', value: ' ' },
      { key: 'Blank', value: '' }
    ];

    return html`
      <sl-grid .items=${items} style="width: 200px">
        <sl-grid-column path="key"></sl-grid-column>
        <sl-grid-filter-column path="value"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const OutsideGrid: Story = {
  render: (_, { loaded: { people } }) => {
    const onInput = ({ target }: Event & { target: TextInput }): void => {
      const grid = document.querySelector('sl-grid') as Grid,
        regex = new RegExp(target.value?.toString().trim() ?? '', 'i');

      grid.items = (people as Person[]).filter(({ firstName, lastName, email, profession }) => {
        return regex.test(firstName) || regex.test(lastName) || regex.test(email) || regex.test(profession);
      });
    };

    return html`
      <style>
        sl-text-input {
          margin-bottom: 1rem;
          width: 300px;
        }
      </style>
      <sl-text-input @input=${onInput} placeholder="Filter here"></sl-text-input>
      <sl-grid .items=${people}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};
