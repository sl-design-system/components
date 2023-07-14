import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import type { Person } from '@sl-design-system/example-data';
import type { DataSourceSortFunction } from '@sl-design-system/shared';
import { Button } from '@sl-design-system/button';
import { getPeople } from '@sl-design-system/example-data';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Sorting',
  loaders: [async () => ({ people: (await getPeople()).people })]
} satisfies Meta;

export const Basic: Story = {
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

export const Custom: Story = {
  render: (_, { loaded: { people } }) => {
    const renderer = ({ firstName, lastName }: Person): TemplateResult => {
      return html`<sl-button>${firstName} ${lastName}</sl-button>`;
    };

    const sorter: DataSourceSortFunction<Person> = (a: Person, b: Person): number => {
      if (a.lastName === b.lastName) {
        if (a.firstName === b.firstName) {
          return 0;
        } else {
          return a.firstName < b.firstName ? -1 : 1;
        }
      } else {
        return a.lastName < b.lastName ? -1 : 1;
      }
    };

    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column header="User" .renderer=${renderer} .sort=${sorter}></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const Sorted: Story = {
  render: (_, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column direction="asc" path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const ScopedElements: Story = {
  render: (_, { loaded: { people } }) => {
    const renderer = ({ firstName, lastName }: Person): TemplateResult => {
      return html`<sl-button>${firstName} ${lastName}</sl-button>`;
    };

    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column
          header="User"
          path="firstName"
          .renderer=${renderer}
          .scopedElements=${{ 'sl-button': Button }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};
