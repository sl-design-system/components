import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { ArrayDataSource } from '@sl-design-system/shared';
import { type TextField } from '@sl-design-system/text-field';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Filtering',
  tags: ['draft'],
  loaders: [async () => ({ people: (await getPeople()).people })],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-filter-column mode="text" path="profession"></sl-grid-filter-column>
      <sl-grid-filter-column path="status"></sl-grid-filter-column>
      <sl-grid-filter-column path="membership"></sl-grid-filter-column>
    </sl-grid>
  `
};

export const Filtered: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-filter-column mode="text" path="profession" value="Endo"></sl-grid-filter-column>
      <sl-grid-filter-column path="status" value="Available"></sl-grid-filter-column>
      <sl-grid-filter-column path="membership" value="Regular,Premium"></sl-grid-filter-column>
    </sl-grid>
  `
};

export const FilteredDataSource: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.addFilter('filter-profession', 'profession', 'Endo');
    dataSource.addFilter('filter-status', 'status', 'Available');
    dataSource.addFilter('filter-membership', 'membership', ['Regular', 'Premium']);

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-filter-column id="filter-profession" mode="text" path="profession"></sl-grid-filter-column>
        <sl-grid-filter-column id="filter-status" path="status"></sl-grid-filter-column>
        <sl-grid-filter-column id="filter-membership" path="membership"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};
export const FilteringWithSelection: Story = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-selection-column></sl-grid-selection-column>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-filter-column path="status"></sl-grid-filter-column>
      <sl-grid-filter-column path="membership"></sl-grid-filter-column>
    </sl-grid>
  `
};

export const Custom: Story = {
  render: (_, { loaded: { people } }) => {
    const filter = (person: Person): boolean => {
      return person.profession === 'Gastroenterologist';
    };

    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.addFilter('custom', filter);

    return html`
      <p>This grid filters people on the "Gastroenterologist" profession via a custom filter on the data directly.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-filter-column path="status"></sl-grid-filter-column>
        <sl-grid-filter-column path="membership"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const EmptyValues: Story = {
  render: () => {
    const items = [
      { key: 'Foo', value: 'foo' },
      { key: '"0"', value: '0' },
      { key: '0', value: 0 },
      { key: 'Spaces', value: '          ' },
      { key: 'Blank', value: '' },
      { key: 'Null', value: null },
      { key: 'Undefined', value: undefined }
    ];

    return html`
      <sl-grid .items=${items} style="width: 200px">
        <sl-grid-column path="key"></sl-grid-column>
        <sl-grid-filter-column path="value"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const Grouped: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-filter-column mode="text" path="profession"></sl-grid-filter-column>
        <sl-grid-filter-column path="status"></sl-grid-filter-column>
        <sl-grid-filter-column path="membership"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const OutsideGrid: Story = {
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);

    const onInput = ({ target }: Event & { target: TextField }): void => {
      const value = target.value?.toString().trim() ?? '';

      if (value) {
        const regex = new RegExp(value, 'i');

        dataSource.addFilter('search', ({ firstName, lastName, email, profession }) => {
          return regex.test(firstName) || regex.test(lastName) || regex.test(email) || regex.test(profession);
        });
      } else {
        dataSource.removeFilter('search');
      }

      dataSource.update();
    };

    return html`
      <style>
        sl-text-field {
          margin-bottom: 1rem;
          width: 300px;
        }
      </style>
      <sl-text-field @input=${onInput} placeholder="Filter here"></sl-text-field>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const ReorderColumns: Story = {
  render: (_, { loaded: { people } }) => {
    class GridReorderExample extends LitElement {
      @state()
      columns = [
        { path: 'firstName' },
        { path: 'lastName' },
        { path: 'profession', type: 'filter' },
        { path: 'status', type: 'filter' },
        { path: 'membership', type: 'filter' }
      ];

      override render(): TemplateResult {
        return html`
          <sl-button-bar style="margin-block-end: 1rem">
            <sl-button @click=${this.onClick}>Reorder columns</sl-button>
          </sl-button-bar>
          <sl-grid .items=${people}>
            ${repeat(
              this.columns,
              column => column.path,
              column => {
                if (column.type === 'filter') {
                  return html`<sl-grid-filter-column .path=${column.path}></sl-grid-filter-column>`;
                } else {
                  return html`<sl-grid-column .path=${column.path}></sl-grid-column>`;
                }
              }
            )}
          </sl-grid>
        `;
      }

      onClick(): void {
        this.columns = [...this.columns.sort(() => Math.random() - 0.5)];
      }
    }

    try {
      customElements.define('grid-reorder-example', GridReorderExample);
    } catch {
      /* empty */
    }

    return html`<grid-reorder-example></grid-reorder-example>`;
  }
};
