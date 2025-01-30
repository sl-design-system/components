import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type GridDropFilter, type SlDropEvent } from '../grid.js';

type Story = StoryObj;

export default {
  title: 'Grid/Drag and drop',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
};

export const Between: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
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

export const OnTop: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    const dropFilter: GridDropFilter<Person> = ({ membership }) => membership !== 'Regular';

    const onDrop = (event: SlDropEvent<Person>): void => {
      console.log('Dropped', event.detail.item, event.detail.relativeItem);
    };

    return html`
      <sl-grid @sl-grid-drop=${onDrop} draggable-rows="on-top" .dropFilter=${dropFilter} .items=${people}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Fixed: Story = {
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })],
  render: (_, { loaded: { people } }) => {
    (people as Array<Person & { draggable: boolean }>).forEach(
      (person, index) => (person.draggable = index > 0 && index <= 6)
    );

    return html`
      <sl-grid .items=${people}>
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
    const dataSource = new ArrayListDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    return html`
      <sl-grid .dataSource=${dataSource}>
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
