import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource, type ListDataSourceItem } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
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
        { id: 'school-1', label: 'Gymnasium Sankt Georg', collapsed: true },
        { id: 'school-2', label: 'Lycée Victor Hugo', collapsed: true },
        { id: 'school-3', label: 'Collegio San Marco', collapsed: true },
        { id: 'school-4', label: 'Koninklijk Atheneum', collapsed: true },
        { id: 'school-5', label: 'Instituto Cervantes', collapsed: true },
        { id: 'school-6', label: 'Colegio San Isidro', collapsed: true }
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

    const groupHeaderRenderer = (item: ListDataSourceItem<Student>) => {
      return html`
        <span slot="group-heading">${item.label} (${item.count})</span>
        <sl-menu-button fill="ghost" size="sm" style="margin: 4px;">
          <sl-icon name="ellipsis" slot="button"></sl-icon>
          <sl-menu-item>Option 1</sl-menu-item>
          <sl-menu-item>Option 2</sl-menu-item>
        </sl-menu-button>
      `;
    };

    return html`
      <p>This example shows how you can customize the group header.</p>
      <sl-grid
        .dataSource=${dataSource}
        .groupHeaderRenderer=${groupHeaderRenderer}
        .scopedElements=${{
          'sl-icon': Icon,
          'sl-menu-button': MenuButton,
          'sl-menu-item': MenuItem
        }}
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
