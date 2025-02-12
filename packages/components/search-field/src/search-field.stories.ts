import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type SearchField } from './search-field.js';

type Props = Pick<SearchField, 'disabled' | 'placeholder' | 'value'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Search field',
  tags: ['preview'],
  args: {
    placeholder: '',
    value: ''
  },
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  render: ({ disabled, placeholder, value }) => {
    return html`
      <sl-search-field
        aria-label="Search"
        ?disabled=${disabled}
        .placeholder=${placeholder}
        .value=${value}
      ></sl-search-field>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    placeholder: 'Search'
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Value: Story = {
  args: {
    ...Basic.args,
    value: 'Lorem'
  }
};

export const Complete: Story = {
  render: () => {
    return html`
      <style>
        search {
          display: flex;
          gap: 0.5rem;
          inline-size: 100%;
        }
        sl-search-field {
          flex: 1;
        }
      </style>
      <search>
        <sl-search-field
          aria-labelledby="search-button"
          id="search-field"
          placeholder="Enter your query"
        ></sl-search-field>
        <sl-button aria-controls="search-field" id="search-button">Search</sl-button>
      </search>
    `;
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          align-items: center;
          display: inline-grid;
          gap: 1rem;
          grid-template-columns: auto 1fr 1fr;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="justify-self: center">md</span>
        <span style="justify-self: center">lg</span>

        <span>Empty</span>
        <sl-search-field placeholder="Placeholder"></sl-search-field>
        <sl-search-field placeholder="Placeholder" size="lg"></sl-search-field>

        <span>Value</span>
        <sl-search-field aria-label="Search" value="Value"></sl-search-field>
        <sl-search-field aria-label="Search" size="lg" value="Value"></sl-search-field>

        <span>Readonly</span>
        <sl-search-field aria-label="Search" readonly value="Value"></sl-search-field>
        <sl-search-field aria-label="Search" readonly size="lg" value="Value"></sl-search-field>

        <span>Disabled</span>
        <sl-search-field aria-label="Search" disabled value="Value"></sl-search-field>
        <sl-search-field aria-label="Search" disabled size="lg" value="Value"></sl-search-field>
      </div>
    `;
  }
};
