import type { Grid } from '../index.js';
import type { Person } from '@sanomalearning/example-data';
import type { Input } from '@sanomalearning/slds-core/input';
import type { StoryObj } from '@storybook/web-components';
import '@sanomalearning/slds-core/input/register.js';
import { getPeople } from '@sanomalearning/example-data';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Filtering'
};

export const PerColumn: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-filter-column path="firstName"></sl-grid-filter-column>
      <sl-grid-filter-column path="lastName"></sl-grid-filter-column>
      <sl-grid-filter-column path="email"></sl-grid-filter-column>
      <sl-grid-filter-column path="profession"></sl-grid-filter-column>
    </sl-grid>
  `
};

export const OutsideGrid: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onInput = ({ target }: Event & { target: Input }): void => {
      const grid = document.querySelector('sl-grid') as Grid,
        regex = new RegExp(target.value?.toString().trim() ?? '', 'i');

      grid.items = (people as Person[]).filter(({ firstName, lastName, email, profession }) => {
        return regex.test(firstName) || regex.test(lastName) || regex.test(email) || regex.test(profession);
      });
    };

    return html`
      <style>
        sl-input {
          margin-bottom: 1rem;
          width: 300px;
        }
      </style>
      <sl-input @input=${onInput} placeholder="Filter here"></sl-input>
      <sl-grid .items=${people}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};
