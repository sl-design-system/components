import { type Person, getPeople } from '@sl-design-system/example-data';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { type GridColumnDataRenderer } from '../../index.js';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Scrolling',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
};

export const Vertical: Story = {
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

export const VerticalOverflow: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people} style="block-size: 300px; overflow: auto">
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="address.phone"></sl-grid-column>
      <sl-grid-column path="profession"></sl-grid-column>
    </sl-grid>
  `
};

export const Horizontal: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const nameRenderer: GridColumnDataRenderer<Person> = ({ firstName, lastName }) => {
      return html`${firstName} ${lastName}`;
    };

    const columns = [
      'email',
      'profession',
      'address.phone',
      'address.street',
      'address.city',
      'address.zip',
      'address.state'
    ];

    const onAdd = () => {
      const count = document.querySelectorAll('sl-grid-column').length,
        column = document.createElement('sl-grid-column');

      column.path = columns[count - 1];
      document.querySelector('sl-grid')?.appendChild(column);
    };

    const onRemove = () => document.querySelector('sl-grid-column:last-of-type')?.remove();

    return html`
      <style>
        body {
          padding-block-start: 0 !important;
        }
        sl-button-bar {
          padding-block-start: 1rem;
        }
        .cover {
          background: var(--sl-elevation-surface-base-default);
          block-size: 1rem;
          position: sticky;
          inset-block-start: 0;
          z-index: 3;
        }
        sl-grid::part(thead) {
          inset-block-start: 1rem;
        }
      </style>
      <sl-button-bar>
        <sl-button @click=${onAdd}>Add column</sl-button>
        <sl-button @click=${onRemove}>Remove column</sl-button>
      </sl-button-bar>
      <div class="cover"></div>
      <sl-grid .items=${people}>
        <sl-grid-column header="Name" .renderer=${nameRenderer}></sl-grid-column>
        ${columns.map(c => html`<sl-grid-column path=${c}></sl-grid-column>`)}
      </sl-grid>
    `;
  }
};

export const HorizontalOnly: Story = {
  ...Horizontal,
  loaders: [async () => ({ people: (await getPeople({ count: 10 })).people })]
};

export const HorizontalSticky: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const nameRenderer: GridColumnDataRenderer<Person> = ({ firstName, lastName }) => {
      return html`${firstName} ${lastName}`;
    };

    return html`
      <style>
        body {
          padding-block-start: 0 !important;
        }
        .cover {
          background: var(--sl-elevation-surface-base-default);
          block-size: 1rem;
          position: sticky;
          inset-block-start: 0;
          z-index: 3;
        }
        sl-grid::part(thead) {
          inset-block-start: 1rem;
        }
      </style>
      <div class="cover"></div>
      <sl-grid .items=${people}>
        <sl-grid-column header="Name" .renderer=${nameRenderer} sticky></sl-grid-column>
        <sl-grid-column path="email" ellipsize-text sticky></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="address.street"></sl-grid-column>
        <sl-grid-column path="address.city"></sl-grid-column>
        <sl-grid-column path="address.zip"></sl-grid-column>
        <sl-grid-column path="address.state" sticky></sl-grid-column>
      </sl-grid>
    `;
  }
};
