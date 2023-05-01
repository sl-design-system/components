import type { TemplateResult } from 'lit';
import type { StoryObj } from '@storybook/web-components';
import type { Person } from '@sl-design-system/example-data';
import { Button } from '@sl-design-system/button';
import { getPeople } from '@sl-design-system/example-data';
import { html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Sorting'
};

export const Single: Story = {
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

export const ScopedElements: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
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
