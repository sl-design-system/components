import { faPoo } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './register.js';
import { type SearchField } from './search-field.js';

type Props = Pick<
  SearchField,
  | 'disabled'
  | 'placeholder'
  | 'shape'
  | 'size'
  | 'value'
  | 'autocomplete'
  | 'matching'
  | 'suggestionThreshold'
  | 'suggestionPlacement'
  | 'loading'
  | 'unavailable'
>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Search field',
  args: {
    autocomplete: 'off',
    matching: 'starts-with',
    suggestionThreshold: 3,
    suggestionPlacement: 'overlay',
    loading: false,
    unavailable: false,
    placeholder: '',
    value: ''
  },
  argTypes: {
    autocomplete: { control: 'inline-radio', options: ['off', 'inline', 'list', 'both'] },
    matching: { control: 'inline-radio', options: ['starts-with', 'contains'] },
    suggestionPlacement: { control: 'inline-radio', options: ['overlay', 'flow'] },
    suggestionThreshold: { control: { type: 'number', min: 1, max: 3 } },
    shape: {
      control: 'inline-radio',
      options: ['rect', 'pill']
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
  },
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  render: ({
    disabled,
    placeholder,
    shape,
    size,
    value,
    autocomplete,
    matching,
    suggestionThreshold,
    suggestionPlacement,
    loading,
    unavailable
  }) => html`
    <sl-search-field
      aria-label="Search"
      .autocomplete=${autocomplete}
      .matching=${matching}
      .suggestionThreshold=${suggestionThreshold}
      .suggestionPlacement=${suggestionPlacement}
      .loading=${loading}
      .unavailable=${unavailable}
      .suggestions=${['García', 'García Ruiz', 'High West Institute', 'Elementary High School']}
      ?disabled=${disabled}
      .placeholder=${placeholder}
      .shape=${shape}
      .size=${size}
      .value=${value}></sl-search-field>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    placeholder: 'Search'
  }
};

export const Pill: Story = {
  args: {
    ...Basic.args,
    shape: 'pill'
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Large: Story = {
  args: {
    ...Basic.args,
    size: 'lg'
  }
};

export const CustomIcon: Story = {
  name: 'Icon',
  render: ({ disabled, placeholder, shape, size, value }) => {
    Icon.register(faPoo);

    return html`
      <sl-search-field
        aria-label="Search"
        ?disabled=${disabled}
        .placeholder=${placeholder}
        .shape=${shape}
        .size=${size}
        .value=${value}>
        <sl-icon name="far-poo" slot="prefix"></sl-icon>
      </sl-search-field>
    `;
  }
};

export const Value: Story = {
  args: {
    ...Basic.args,
    value: 'Lorem'
  }
};

export const Complete: Story = {
  render: () => html`
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
        placeholder="Enter your query"></sl-search-field>
      <sl-button aria-controls="search-field" id="search-button">Search</sl-button>
    </search>
  `
};

export const All: Story = {
  render: () => html`
    <style>
      .wrapper {
        align-items: center;
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: auto 1fr 1fr;
      }

      .section-header {
        grid-column: 1 / -1;
        font-weight: 600;
        padding-top: 0.5rem;
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

      <span>Empty (pill)</span>
      <sl-search-field placeholder="Placeholder" shape="pill"></sl-search-field>
      <sl-search-field placeholder="Placeholder" shape="pill" size="lg"></sl-search-field>

      <span>Value (pill)</span>
      <sl-search-field aria-label="Search" shape="pill" value="Value"></sl-search-field>
      <sl-search-field aria-label="Search" shape="pill" size="lg" value="Value"></sl-search-field>
    </div>
  `
};

/** Type Gar or High. Enter searches your words; Right Arrow/End accepts inline completion. */
export const Autocomplete: Story = {
  args: { autocomplete: 'both', placeholder: 'Try Gar or High', matching: 'contains' }
};

export const SuggestionsInFlow: Story = {
  args: { ...Autocomplete.args, suggestionPlacement: 'flow' },
  render: () => html`
    <div style="max-width: 30rem">
      <sl-search-field
        aria-label="Search"
        autocomplete="both"
        suggestion-placement="flow"
        matching="contains"
        placeholder="Try High">
        <option>High West Institute</option>
        <option>Elementary High School</option>
      </sl-search-field>
      <p>Content below the field moves down when suggestions appear.</p>
    </div>
  `
};

/** Listen for edits, then replace suggestions independently of sl-search. */
export const AsyncSuggestions: Story = {
  render: () => html`
    <sl-search-field
      aria-label="Search"
      autocomplete="both"
      placeholder="Try Gar"
      .suggestions=${[]}
      @sl-change=${(event: Event) => {
        const field = event.currentTarget as SearchField,
          query = field.value;
        field.loading = true;
        setTimeout(() => {
          if (field.value === query) {
            field.suggestions = ['García', 'Garden', 'Garland'];
            field.loading = false;
          }
        }, 700);
      }}></sl-search-field>
  `
};
