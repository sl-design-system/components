import type { GridColumnRenderer, GridItemParts } from './index.js';
import type { Person } from '@sanomalearning/example-data';
import type { StoryObj } from '@storybook/web-components';
import { getPeople } from '@sanomalearning/example-data';
import { html } from 'lit';
import './register.js';

export interface PersonWithRating extends Person {
  customerRating: number;
}

export default {
  title: 'Grid'
};

export const API: StoryObj = {
  args: {
    noBorder: false,
    noRowBorder: false,
    striped: true
  },
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: ({ noBorder, noRowBorder, striped }, { loaded: { people } }) => html`
    <sl-grid
      .noBorder=${noBorder}
      .noRowBorder=${noRowBorder}
      .items=${people}
      .striped=${striped}
      style="height: 300px; overflow: auto"
    >
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column align="end" path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const ColumnRenderer: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const nameRenderer: GridColumnRenderer<Person> = ({ firstName, lastName }) => {
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

export const CustomStyling: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const items: PersonWithRating[] = (people as Person[]).map(person => ({
        ...person,
        customerRating: Math.random() * 10
      })),
      ratingFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const ratingRenderer: GridColumnRenderer<PersonWithRating> = ({ customerRating }) => {
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
          align="end"
          header="Customer rating (0-10)"
          parts="customer-rating"
          .renderer=${ratingRenderer}
        ></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const SelectionColumn: StoryObj = {
  argTypes: {
    autoSelect: {
      control: 'boolean'
    },
    selectAll: {
      control: 'boolean'
    }
  },
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: ({ autoSelect, selectAll }, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
        <sl-grid-selection-column .autoSelect=${autoSelect} .selectAll=${selectAll}></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const SortableColumns: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const StickyColumns: StoryObj = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const nameRenderer: GridColumnRenderer<Person> = ({ firstName, lastName }) => {
      return html`${firstName} ${lastName}`;
    };

    return html`
      <sl-grid .items=${people} style="height: 300px; overflow: auto">
        <sl-grid-column header="Name" .renderer=${nameRenderer} sticky></sl-grid-column>
        <sl-grid-column path="email" sticky></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="address.street"></sl-grid-column>
      </sl-grid>
    `;
  }
};
