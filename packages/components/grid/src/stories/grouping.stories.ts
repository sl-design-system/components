import { type Person, getPeople } from '@sl-design-system/example-data';
import { ArrayDataSource } from '@sl-design-system/shared';
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
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Collapsed: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    setTimeout(() => {
      const grid = document.querySelector('sl-grid')!;
      grid.view.groups.forEach(group => grid.view.toggleGroup(group));
    });

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};
