import type { Grid, GridActiveItemChangeEvent } from '../index.js';
import type { StoryObj } from '@storybook/web-components';
import type { Person } from '@sanomalearning/example-data';
import { getPeople } from '@sanomalearning/example-data';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Selection'
};

export const Single: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onActiveItemChange = ({
      item,
      target: grid
    }: GridActiveItemChangeEvent<Person> & { target: Grid<Person> }): void => {
      grid.selection.select(item);
    };

    return html`
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

export const Multiple: StoryObj = {
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

export const MultipleAutoSelect: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
        <sl-grid-selection-column auto-select></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};
