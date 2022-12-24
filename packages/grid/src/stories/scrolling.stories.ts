import type { GridColumnDataRenderer } from '../index.js';
import type { Person } from '@sanomalearning/example-data';
import type { StoryObj } from '@storybook/web-components';
import { getPeople } from '@sanomalearning/example-data';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Scrolling'
};

export const VerticalOverflow: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} style="height: 300px; overflow: auto">
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const VerticalPage: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const HorizontalSticky: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const nameRenderer: GridColumnDataRenderer<Person> = ({ firstName, lastName }) => {
      return html`${firstName} ${lastName}`;
    };

    return html`
      <sl-grid .items=${people} style="width: calc(100vw-32px); overflow-x: auto">
        <sl-grid-column header="Name" .renderer=${nameRenderer} sticky></sl-grid-column>
        <sl-grid-column path="email" sticky></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="address.street"></sl-grid-column>
        <sl-grid-column path="address.city"></sl-grid-column>
        <sl-grid-column path="address.zip"></sl-grid-column>
        <sl-grid-column path="address.state"></sl-grid-column>
      </sl-grid>
    `;
  }
};
