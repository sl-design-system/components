import { Button } from '@sl-design-system/button';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'In progress/Grid/Sorting',
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

    const sorter = (a: Person, b: Person): number => {
      const lastNameCmp = a.lastName.localeCompare(b.lastName);

      if (lastNameCmp === 0) {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return lastNameCmp;
      }
    };

    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column header="User" .renderer=${renderer} .sorter=${sorter}></sl-grid-sort-column>
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
