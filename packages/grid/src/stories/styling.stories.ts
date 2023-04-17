import type { GridColumnDataRenderer, GridItemParts } from '../../index.js';
import type { Person } from '@sanomalearning/example-data';
import type { StoryObj } from '@storybook/web-components';
import { getPeople } from '@sanomalearning/example-data';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export interface PersonWithRating extends Person {
  customerRating: number;
}

export default {
  title: 'Styling'
};

export const NoBorders: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} no-border no-row-border>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const Striped: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} striped>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const Parts: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const items: PersonWithRating[] = (people as Person[]).map(person => ({
        ...person,
        customerRating: Math.random() * 10
      })),
      ratingFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const ratingRenderer: GridColumnDataRenderer<PersonWithRating> = ({ customerRating }) => {
      return html`${ratingFormatter.format(customerRating)}`;
    };

    const itemParts: GridItemParts<PersonWithRating> = ({ customerRating }) => {
      if (customerRating < 4) {
        return 'low-rating';
      } else if (customerRating > 8) {
        return 'high-rating';
      }
    };

    return html`
      <style>
        sl-grid::part(customer-rating) {
          font-weight: bold;
        }
        sl-grid::part(high-rating) {
          --_cell-background: #e5ffe8;
        }
        sl-grid::part(low-rating) {
          --_cell-background: #fff0f0;
        }
      </style>
      <sl-grid .items=${items} .itemParts=${itemParts}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
        <sl-grid-column
          .renderer=${ratingRenderer}
          align="end"
          header="Customer rating (0-10)"
          path="customer-rating"
        ></sl-grid-column>
      </sl-grid>
    `;
  }
};
