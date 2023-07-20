import type { StoryObj } from '@storybook/web-components';
import type { Person } from '@sl-design-system/example-data';
import { getPeople } from '@sl-design-system/example-data';
import { ArrayDataSource } from '@sl-design-system/shared';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Data Source',
  loaders: [async () => ({ people: (await getPeople()).people })]
};

export const Simple: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Sorting: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.sortValue = { path: 'firstName', direction: 'asc' };

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Filtering: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.filterValues = [
      { path: 'membership', value: 'Regular' },
      { path: 'status', value: 'Available' }
    ];

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-filter-column path="status"></sl-grid-filter-column>
        <sl-grid-filter-column path="membership"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};
