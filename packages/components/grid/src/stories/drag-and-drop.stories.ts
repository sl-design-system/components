import type { GridItemDropEvent } from '../events.js';
import type { StoryObj } from '@storybook/web-components';
import type { Person } from '@sl-design-system/example-data';
import { getPeople } from '@sl-design-system/example-data';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Drag and drop'
};

export const Basic: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onDrop = (event: GridItemDropEvent<Person>): void => {
      // Reorder the person in the grid
      const newPeople = [...(event.grid.items as Person[])],
        person = newPeople.splice(event.oldIndex, 1)[0];
      newPeople.splice(event.newIndex, 0, person);

      event.grid.items = newPeople;
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
