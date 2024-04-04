import { type Person, getPeople } from '@sl-design-system/example-data';
import { ArrayDataSource } from '@sl-design-system/shared';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type SlDropEvent } from '../grid.js';

type Story = StoryObj;

export default {
  title: 'Grid/Drag and drop'
};

export const Basic: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    const onDrop = ({ detail: { grid, oldIndex, newIndex } }: SlDropEvent<Person>): void => {
      const items = [...grid.items!],
        person = items.splice(oldIndex, 1)[0];
      items.splice(newIndex, 0, person);

      grid.items = items;
    };

    return html`
      <sl-grid @sl-grid-drop=${onDrop} .items=${people}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Partial: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    (people as Array<Person & { draggable: boolean }>).forEach((person, index) => (person.draggable = index <= 6));

    const onDrop = ({ detail: { grid, oldIndex, newIndex } }: SlDropEvent<Person>): void => {
      const items = [...grid.items!],
        person = items.splice(oldIndex, 1)[0];
      items.splice(newIndex, 0, person);

      grid.items = items;
    };

    return html`
      <sl-grid @sl-grid-drop=${onDrop} .items=${people}>
        <sl-grid-drag-handle-column path="draggable"></sl-grid-drag-handle-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Grouping: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    const onDrop = ({ detail: { grid, oldIndex, newIndex } }: SlDropEvent<Person>): void => {
      console.log('Dropped', oldIndex, newIndex);

      // Reorder the person in the grid
      const items = [...dataSource.items],
        person = items.splice(oldIndex, 1)[0];
      items.splice(newIndex, 0, person);

      console.log(items.at(newIndex - 1));
      console.log(items.at(newIndex));
      console.log(items.at(newIndex + 1));

      grid.items = items;
    };

    return html`
      <sl-grid @sl-grid-drop=${onDrop} .dataSource=${dataSource}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
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
