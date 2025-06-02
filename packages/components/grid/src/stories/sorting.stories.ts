import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../register.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Sorting',
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
        This example shows how sorting works in a grid. You enable sorting by adding
        <code>sl-grid-sort-column</code> elements to the grid. This will automatically enable sorting on the column. If
        you want to have an initial sort, you can set the <code>direction</code> attribute to either <code>asc</code> or
        <code>desc</code>. Unlike filtering, not every column needs to be sortable.
      </p>
      <sl-grid .items=${students}>
        <sl-grid-sort-column grow="0" header="Nr." path="studentNumber"></sl-grid-sort-column>
        <sl-grid-sort-column
          direction="asc"
          grow="3"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const DataSource: Story = {
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], { sortBy: 'fullName', sortDirection: 'asc' });

    return html`
      <p>
        This example shows how the grid is sorted by specifying the sort on the data source directly. You can set the
        initial sort by passing the <code>sortBy</code> and <code>sortDirection</code> options to the data source.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column grow="0" header="Nr." path="studentNumber"></sl-grid-sort-column>
        <sl-grid-sort-column
          grow="3"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const CustomSorter: Story = {
  render: (_, { loaded: { students } }) => {
    const sorter = (a: Student, b: Student): number => {
      const lastNameCmp = a.lastName.localeCompare(b.lastName);

      if (lastNameCmp === 0) {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return lastNameCmp;
      }
    };

    return html`
      <p>
        This example shows how you can provide a custom sorter function if the default behavior isn't sufficient. The
        grid sorts items by last name, then first name. You can provide a custom sorter function by passing the
        <code>sorter</code> property to the <code>sl-grid-sort-column</code> element. The function should return a
        negative number if the first item is less than the second, a positive number if it's greater, and zero if
        they're equal (similar to the <code>Array.prototype.sort</code> method).
      </p>
      <sl-grid .items=${students}>
        <sl-grid-sort-column
          direction="asc"
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
          .sorter=${sorter}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const Grouped: Story = {
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name',
      groupSortDirection: 'desc'
    });

    return html`
      <p>
        This example shows how sorting works in combination with grouping. The groups are sorted by their labels in
        descending order. Within the groups, the students are sorted by their name in ascending order. This is achieved
        by setting the <code>groupSortDirection</code> option in the data source constructor, and the
        <code>direction</code> property on the <code>sl-grid-sort-column</code> element.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column grow="0" header="Nr." path="studentNumber"></sl-grid-sort-column>
        <sl-grid-sort-column
          direction="asc"
          grow="3"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};
