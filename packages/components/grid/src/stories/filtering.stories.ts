import { Avatar } from '@sl-design-system/avatar';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type SearchField } from '@sl-design-system/search-field';
import '@sl-design-system/search-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../register.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Filtering',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { students } }) => {
    return html`
      <p>
        This example filters students based on their name and school. The filters are set declaratively on the
        <code>sl-grid-filter-column</code> elements using its <code>value</code> property. It filters on the school id,
        not the school name. This prevents unwanted behavior for schools with similar names. But showing the school ids
        is also unwanted behavior. Therefore, the <code>label-path</code> property is used to show the name of the
        school instead of the id.
      </p>
      <sl-grid .items=${students}>
        <sl-grid-filter-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
          value="ma"
        ></sl-grid-filter-column>
        <sl-grid-filter-column header="Group" path="group.name"></sl-grid-filter-column>
        <sl-grid-filter-column
          header="School"
          label-path="school.name"
          mode="select"
          path="school.id"
          value="school-3"
        ></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const DataSource: Story = {
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      filters: [
        { id: 'filter-school', by: 'school.id', value: 'school-1' },
        { id: 'filter-student', by: 'fullName', value: 'ma' }
      ]
    });

    return html`
      <p>
        This example is filtered on the students name and the school. The difference here is that the filter is set
        programmatically on the data source using the <code>filters</code> option in the constructor. Remember to set an
        <code>id</code> on the <code>sl-grid-filter-column</code> element and use the same <code>id</code> as the id
        property in the filter config. That way the filter on the data source and the filter column are linked together.
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
          path="school.id"
        ></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const Selection: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows how you can combine selection and filtering in a grid. Even though some rows may not be visible
      due to filtering, any selected rows will remain selected.
    </p>
    <sl-grid .items=${students}>
      <sl-grid-selection-column></sl-grid-selection-column>
      <sl-grid-filter-column
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}
      ></sl-grid-filter-column>
      <sl-grid-filter-column path="email"></sl-grid-filter-column>
    </sl-grid>
  `
};

export const Custom: Story = {
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      filters: [{ id: 'custom', by: (student: Student): boolean => student.school.id === 'school-1' }]
    });

    return html`
      <p>
        This example filters students on the "Gymnasium Sankt Georg" school via a custom filter on the data source
        directly. There are no filter columns in this grid.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column
          header="Student"
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
  loaders: [],
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
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    return html`
      <p>
        This example shows how you can combine grouping with filtering in a grid. Any groups that do not have any items
        that match the filter criteria will not be shown.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-filter-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-filter-column>
        <sl-grid-filter-column path="email"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};

export const Outside: Story = {
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[]);

    const onInput = ({ target }: Event & { target: SearchField }): void => {
      const value = target.value?.toString().trim() ?? '';

      if (value) {
        const regex = new RegExp(value, 'i');

        dataSource.addFilter('search', ({ fullName, email }) => {
          return regex.test(fullName) || regex.test(email);
        });
      } else {
        dataSource.removeFilter('search');
      }

      dataSource.update();
    };

    return html`
      <style>
        .header {
          display: grid;
          grid-template-rows: auto auto;
          margin-block-end: 1rem;
        }
        sl-search-field {
          justify-self: end;
          width: 300px;
        }
      </style>
      <div class="header">
        <p>
          This example shows how you can filter a grid using an external search field. The way to implement this is by
          listening to the input event of the search field and updating the data source accordingly using the
          <code>addFilter</code> and <code>removeFilter</code> methods. When you filter using the search field, you can
          still narrow the filter using the filter columns in the grid. The search field is not linked to any of the
          filter columns.
        </p>
        <sl-search-field @input=${onInput} placeholder="Filter here"></sl-search-field>
      </div>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-filter-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-filter-column>
        <sl-grid-filter-column path="email"></sl-grid-filter-column>
      </sl-grid>
    `;
  }
};
