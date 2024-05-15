import { type Person, getPeople } from '@sl-design-system/example-data';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type GridColumnDataRenderer } from '../column.js';
import { type GridItemParts } from '../grid.js';

type Story = StoryObj;

export interface PersonWithRating extends Person {
  customerRating: number;
}

export default {
  title: 'Layout/Grid/Styling'
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

      return undefined;
    };

    return html`
      <style>
        sl-grid::part(thead) {
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
          clip-path: inset(0 0 -10px 0);
        }
        sl-grid::part(data customer-rating) {
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
