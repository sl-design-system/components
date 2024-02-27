import type { GridItemDropEvent } from '../events.js';
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

export const Filtering: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.addFilter('membership-filter', 'membership', ['Regular']);
    dataSource.addFilter('status-filter', 'status', ['Available']);

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-filter-column id="status-filter" path="status"></sl-grid-filter-column>
        <sl-grid-filter-column id="membership-filter" path="membership"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const Sorting: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setSort('first-name', 'firstName', 'asc');

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column id="first-name" path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const CustomFiltering: Story = {
  render: (_, { loaded: { people } }) => {
    const filter = (person: Person): boolean => {
      return person.profession === 'Gastroenterologist';
    };

    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.addFilter('custom', filter);

    return html`
      <p>This grid filters people on the "Gastroenterologist" profession via a custom filter on the data directly.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-filter-column path="status"></sl-grid-filter-column>
        <sl-grid-filter-column path="membership"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const CustomSorting: Story = {
  render: (_, { loaded: { people } }) => {
    const sorter = (a: Person, b: Person): number => {
      const lastNameCmp = a.lastName.localeCompare(b.lastName);

      if (lastNameCmp === 0) {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return lastNameCmp;
      }
    };

    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setSort('custom', sorter, 'asc');

    return html`
      <p>This grid sorts people by last name, then first name, via a custom sorter on the data directly.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Selection: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const SelectionDragAndDrop: Story = {
  render: (_, { loaded: { people } }) => {
    const onDrop = (event: GridItemDropEvent<Person>): void => {
      // Reorder the person in the grid
      const newPeople = [...(people as Person[])],
        person = newPeople.splice(event.oldIndex, 1)[0];
      newPeople.splice(event.newIndex, 0, person);

      const dataSource = new ArrayDataSource(newPeople);
      dataSource.update();
    };

    const dataSource = new ArrayDataSource(people as Person[]);

    return html`
      <sl-grid @sl-grid-drop=${onDrop} .dataSource=${dataSource}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};
