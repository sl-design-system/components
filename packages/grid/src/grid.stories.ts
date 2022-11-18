import type { GridColumnRenderer } from './column.js';
import type { Person } from '@sanomalearning/example-data';
import { getPeople } from '@sanomalearning/example-data';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Grid'
};

export const API: StoryObj = {
  args: {
    noBorder: false,
    noRowBorder: false
  },
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: ({ noBorder, noRowBorder }, { loaded: { people } }) => html`
    <sl-grid .noBorder=${noBorder} .noRowBorder=${noRowBorder} .items=${people} style="height: 300px">
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const ColumnRenderer: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const nameRenderer: GridColumnRenderer<Person> = person => {
      return html`${person.firstName} ${person.lastName}`;
    };

    return html`
      <sl-grid .items=${people} style="height: 300px">
        <sl-grid-column header="Name" .renderer=${nameRenderer}></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};
