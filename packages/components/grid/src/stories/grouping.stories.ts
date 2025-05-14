import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import {
  ArrayListDataSource,
  type ListDataSourceGroupItem,
  isListDataSourceGroupItem
} from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Grouping',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
};

export const Basic: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    return html`
      <p>This example shows the basics of grouping. Students are sorted by name and grouped by school.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column
          direction="asc"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Collapsed: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groups: [
        { id: 'school-6', label: 'Colegio San Isidro', collapsed: true, count: 1 },
        { id: 'school-3', label: 'Collegio San Marco', collapsed: true, count: 10 },
        { id: 'school-1', label: 'Gymnasium Sankt Georg', collapsed: true, count: 11 },
        { id: 'school-5', label: 'Instituto Cervantes', collapsed: true, count: 3 },
        { id: 'school-4', label: 'Koninklijk Atheneum', collapsed: true, count: 14 },
        { id: 'school-2', label: 'Lycée Victor Hugo', collapsed: true, count: 9 }
      ]
    });

    return html`
      <p>This example shows how you start with all groups collapsed.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Sorted: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name',
      groupSortDirection: 'desc'
    });

    return html`
      <p>
        This example shows how the groups are sorted descending. Within the groups, the students are sorted using their
        name. The latter is done via the regular sort header.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column
          direction="asc"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const SortedByFunction: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name',
      groupSortBy: (a, b) => {
        const valueA = (isListDataSourceGroupItem(a) ? a.label : a.group?.label) ?? '',
          valueB = (isListDataSourceGroupItem(b) ? b.label : b.group?.label) ?? '';

        if (valueA === valueB) {
          return 0;
        } else if (valueA.startsWith('Koninklijk')) {
          return -1;
        } else if (valueB.startsWith('Koninklijk')) {
          return 1;
        } else {
          return valueA?.localeCompare(valueB);
        }
      }
    });

    return html`
      <p>
        This example shows how a custom sort function is used to place "Koninklijk Atheneum" above all other
        (alphabetically) sorted schools. Within the groups, students are sorted by their name using the regular sort
        header.
      </p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column
          direction="asc"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const DragAndDrop: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    return html`
      <p>This example shows how you combine grouping with drag and drop.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
        <sl-grid-sort-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Selection: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name',
      selects: 'multiple'
    });

    return html`
      <p>This example shows how you combine grouping with selection.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-sort-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Both: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    return html`
      <p>This example shows how you combine grouping with drag and drop and selection.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-sort-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const CustomGroupHeader: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: (_, { loaded: { students } }) => {
    const dataSource = new ArrayListDataSource(students as Student[], {
      groupBy: 'school.id',
      groupLabelPath: 'school.name'
    });

    const groupHeaderRenderer = (item: ListDataSourceGroupItem) => {
      return html`
        <span slot="group-heading">${item.label} (${item.count})</span>
        <sl-button size="sm">Add student</sl-button>
      `;
    };

    return html`
      <p>
        This example shows how you can customize the group header. By using the
        <code>groupHeaderRenderer</code> callback property, it adds an "Add student" button to the group header. When
        doing this, do not forget to also set the <code>scopedElements</code> property to include the custom elements
        used in the renderer.
      </p>
      <sl-grid
        .dataSource=${dataSource}
        .groupHeaderRenderer=${groupHeaderRenderer}
        .scopedElements=${{ 'sl-button': Button }}
      >
        <sl-grid-sort-column
          direction="asc"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
        <sl-grid-column header="School" path="school.name"></sl-grid-column>
      </sl-grid>
    `;
  }
};
