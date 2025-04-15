import { Avatar } from '@sl-design-system/avatar';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import {
  type Person,
  type School,
  type Student,
  getPeople,
  getSchools,
  getStudents
} from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import { type TextField } from '@sl-design-system/text-field';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import '../../register.js';
import { avatarRenderer } from './story-utils.js';

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
  loaders: [
    async () => ({
      schools: await getSchools(),
      students: (await getStudents()).students
    })
  ],
  render: (_, { loaded: { schools, students } }) => {
    return html`
      <sl-grid .items=${students}>
        <sl-grid-filter-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-filter-column>
        <sl-grid-filter-column header="Group" path="group.name"></sl-grid-filter-column>
        <sl-grid-filter-column
          header="School"
          label-path="school.name"
          mode="select"
          .options=${(schools as School[]).map(s => ({ label: s.name, value: s.id }))}
          path="school.id"
          value="school-3"
        ></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const DataSource: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[]);
    dataSource.addFilter('filter-school', 'school.id', 'school-1');

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-filter-column
          id="filter-school"
          header="School"
          label-path="school.name"
          path="school.id"
        ></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};
export const FilteringWithSelection: Story = {
  render: (_, { loaded: { students } }) => html`
    <sl-grid .items=${students}>
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

    const dataSource = new ArrayListDataSource(people as Person[]);
    dataSource.addFilter('custom', filter);

    return html`
      <p>This grid filters people on the "Gastroenterologist" profession via a custom filter on the data directly.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-filter-column path="membership" filter-label="DUO membership status"></sl-grid-filter-column>
        <sl-grid-filter-column
          path="status"
          .header=${html`<sl-icon name="calendar"></sl-icon> Status`}
          .scopedElements=${{ 'sl-icon': Icon }}
        ></sl-grid-filter-column>
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
    const dataSource = new ArrayListDataSource(people as Person[]);
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
    const dataSource = new ArrayListDataSource(people as Person[]);

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
