import type { GridColumnDataRenderer } from '../../index.js';
import type { Person } from '@sanomalearning/example-data';
import type { StoryObj } from '@storybook/web-components';
import { getPeople } from '@sanomalearning/example-data';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Rendering'
};

export const ColumnRenderer: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const nameRenderer: GridColumnDataRenderer<Person> = ({ firstName, lastName }) => {
      return html`${firstName} ${lastName}`;
    };

    return html`
      <sl-grid .items=${people} style="height: 300px; overflow: auto">
        <sl-grid-column header="Name" .renderer=${nameRenderer}></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};
