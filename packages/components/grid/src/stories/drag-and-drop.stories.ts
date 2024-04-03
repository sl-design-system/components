import { type Person, getPeople } from '@sl-design-system/example-data';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type SlDropEvent } from '../grid.js';

type Story = StoryObj;

export default {
  title: 'Grid/Drag and drop'
};

export const Basic: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onDrop = ({ detail: { grid, oldIndex, newIndex } }: SlDropEvent<Person>): void => {
      // Reorder the person in the grid
      const newPeople = [...(grid.items as Person[])],
        person = newPeople.splice(oldIndex, 1)[0];
      newPeople.splice(newIndex, 0, person);

      grid.items = newPeople;
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

export const Grouping: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onDrop = ({ detail: { grid, oldIndex, newIndex } }: SlDropEvent<Person>): void => {
      // Reorder the person in the grid
      const newPeople = [...(grid.items as Person[])],
        person = newPeople.splice(oldIndex, 1)[0];
      newPeople.splice(newIndex, 0, person);

      grid.items = newPeople;
    };

    return html`
      <sl-grid @sl-grid-drop=${onDrop} items-group-by="membership" .items=${people}>
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
