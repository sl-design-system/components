import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import {
  ArrayListDataSource,
  FetchListDataSource,
  FetchListDataSourceError,
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
  loaders: [
    async () => {
      const response = await fetch('https://dummyjson.com/products/categories');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { categories: await response.json() };
    }
  ],
  render: (_, { loaded: { categories } }) => {
    interface Category {
      slug: string;
      name: string;
      url: string;
    }

    interface Product {
      id: number;
      title: string;
      description: string;
      category: string;
    }

    interface ProductsResponse {
      products: Product[];
      total: number;
    }

    const dataSource = new FetchListDataSource({
      groupBy: 'category',
      groups: (categories as Category[]).map(c => ({
        id: c.slug,
        label: c.name,
        type: 'group',
        collapsed: true
      })),
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const response = await fetch(`https://dummyjson.com/products?skip=${page * pageSize}&limit=${pageSize}`);

        if (response.ok) {
          const { products, total } = (await response.json()) as ProductsResponse;

          return { items: products, totalItems: total };
        } else {
          throw new FetchListDataSourceError('Failed to fetch data', response);
        }
      }
    });

    return html`
      <p>This example shows how you start with all groups collapsed.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-column header="Product" path="title"></sl-grid-column>
        <sl-grid-column header="Category" path="category"></sl-grid-column>
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
