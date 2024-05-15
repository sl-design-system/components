import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { ArrayDataSource, type SelectionController } from '@sl-design-system/shared';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type SlActiveItemChangeEvent } from '../grid.js';

type Story = StoryObj;

export default {
  title: 'Layout/Grid/Selection'
};

export const Single: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onActiveItemChange = ({ detail: { item, grid } }: SlActiveItemChangeEvent<Person>): void => {
      grid.selection.select(item);
    };

    return html`
      <style>
        sl-grid::part(row) {
          cursor: pointer;
        }
        sl-grid::part(row):hover {
          --_cell-background: #f5f5f5;
        }
      </style>
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

export const Multiple: Story = {
  args: {
    selectAll: false
  },
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: ({ selectAll }, { loaded: { people } }) => {
    const onSelectionChange = ({ detail: selection }: CustomEvent<SelectionController>): void => {
      const p = document.querySelector<HTMLParagraphElement>('.selection')!;

      if (selection.areAllSelected()) {
        p.innerText = `${selection.size} of ${selection.size} selected`;
      } else if (selection.areSomeSelected()) {
        p.innerText = `${selection.selection.size} of ${selection.size} selected`;
      } else {
        p.innerText = 'No selection';
      }
    };

    return html`
      <p class="selection" style="margin-block: 0 1rem">
        This is updated outside the component by listening to the <code>sl-selection-change</code> event.
      </p>
      <sl-grid @sl-selection-change=${onSelectionChange} .items=${people}>
        <sl-grid-selection-column .selectAll=${selectAll}></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const MultipleAutoSelect: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    return html`
      <style>
        sl-grid::part(row) {
          cursor: pointer;
        }
        sl-grid::part(row):hover {
          --_cell-background: #f5f5f5;
        }
      </style>
      <sl-grid .items=${people}>
        <sl-grid-selection-column auto-select></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const MultipleWithCustomHeader: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: ({ selectAll }, { loaded: { people } }) => {
    return html`
      <style>
        sl-grid::part(active-selection) {
          gap: 0.5rem;
          padding-block: 0.125rem;
        }
      </style>
      <sl-grid .items=${people}>
        <sl-grid-selection-column .selectAll=${selectAll}></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>

        <sl-button-bar slot="selection-header">
          <sl-button size="sm">Do something</sl-button>
          <sl-button size="sm">Or something else</sl-button>
        </sl-button-bar>
      </sl-grid>
    `;
  }
};

export const Grouped: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};
