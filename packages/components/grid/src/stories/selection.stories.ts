import type { Grid, GridActiveItemChangeEvent } from '../grid.js';
import type { StoryObj } from '@storybook/web-components';
import type { Person } from '@sl-design-system/example-data';
import { getPeople } from '@sl-design-system/example-data';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Selection'
};

export const Single: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onActiveItemChange = ({
      item,
      target: grid
    }: GridActiveItemChangeEvent<Person> & { target: Grid<Person> }): void => {
      grid.selection.select(item);
    };

    return html`
      <style>
        sl-grid::part(row) {
          cursor: pointer;
        }
        sl-grid::part(row):hover {
          --_cell-background: #f5f5f5;
        }
      </style>
      <sl-grid @sl-active-item-change=${onActiveItemChange} .items=${people}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Multiple: Story = {
  args: {
    selectAll: false
  },
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: ({ selectAll }, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
        <sl-grid-selection-column .selectAll=${selectAll}></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const MultipleAutoSelect: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    return html`
      <style>
        sl-grid::part(row) {
          cursor: pointer;
        }
        sl-grid::part(row):hover {
          --_cell-background: #f5f5f5;
        }
      </style>
      <sl-grid .items=${people}>
        <sl-grid-selection-column auto-select></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};
