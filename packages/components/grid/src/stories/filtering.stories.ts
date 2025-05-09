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
      <p>
        This example filters students based on their school. The filter is set declaratively on the
        <code>sl-grid-filter-column</code> element using its <code>value</code> property.
      </p>
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
  loaders: [
    async () => ({
      schools: await getSchools(),
      students: (await getStudents()).students
    })
  ],
  render: (_, { loaded: { schools, students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[]);
    dataSource.addFilter('filter-school', 'school.id', 'school-1');
    dataSource.addFilter('filter-student', 'fullName', 'ma');

    return html`
      <p>
        This example is filtered on the students name and the school. The difference here is that the filter is set
        programmatically on the data source using the <code>addFilter</code> method. Remember to set an
        <code>id</code> on the <code>sl-grid-filter-column</code> element and use the same <code>id</code> as the first
        argument in the <code>addFilter</code> method. That way the filter on the data source and the filter column are
        linked together.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-filter-column
          id="filter-student"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-filter-column>
        <sl-grid-filter-column
          id="filter-school"
          header="School"
          label-path="school.name"
          mode="select"
          .options=${(schools as School[]).map(s => ({ label: s.name, value: s.id }))}
          path="school.id"
        ></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const Selection: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => html`
    <p>This example shows how you can combine selection and filtering in a grid.</p>
    <sl-grid .items=${students}>
      <sl-grid-selection-column></sl-grid-selection-column>
      <sl-grid-filter-column path="fullName"></sl-grid-filter-column>
      <sl-grid-filter-column path="email"></sl-grid-filter-column>
    </sl-grid>
  `
};

export const Custom: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const filter = (student: Student): boolean => {
      console.log('filtering', student);

      return student.school.id === 'school-1';
    };

    const dataSource = new ArrayListDataSource(students as Student[]);
    dataSource.addFilter('custom', filter);
    dataSource.update();

    return html`
      <p>
        This example filters students on the "Gymnasium Sankt Georg" school via a custom filter on the data source
        directly. There are no filter columns in this grid. This approach is similar to how filtering works outside of
        the grid. Remember to explicitly call the <code>update</code> method on the data source after adding a filter.
        This is necessary because there are no UI elements that trigger the update.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
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
      { key: 'Number', value: 12345 },
      { key: 'Spaces', value: '          ' },
      { key: 'Blank', value: '' },
      { key: 'Null', value: null },
      { key: 'Undefined', value: undefined }
    ];

    return html`
      <p>This example shows how filtering works with different kind of values.</p>
      <sl-grid .items=${items}>
        <sl-grid-filter-column path="key"></sl-grid-filter-column>
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
      <p>This example shows how you can combine grouping with filtering in a grid.</p>
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
