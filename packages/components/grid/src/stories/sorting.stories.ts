import { Avatar } from '@sl-design-system/avatar';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Person, type Student, getPeople, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../../register.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Sorting',
  tags: ['draft'],
  loaders: [async () => ({ people: (await getPeople()).people })],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
} satisfies Meta;

export const Basic: Story = {
  loaders: [async () => ({ students: (await getStudents()).students })],
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
  loaders: [async () => ({ students: (await getStudents()).students })],
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

export const CustomSorterFunction: Story = {
  render: () => {
    interface Foo {
      description: string;
      code: string;
    }

    const items: Foo[] = [
      { description: 'B', code: 'b' },
      { description: 'a', code: 'A' },
      { description: 'c', code: 'C' },
      { description: 'D', code: 'd' }
    ];

    const sort = (a: Foo, b: Foo): number => {
      const isLowerCase = (str: string) => str === str.toLowerCase(),
        isUpperCase = (str: string) => str === str.toUpperCase();

      if (isLowerCase(a.description) && isUpperCase(b.description)) {
        return -1;
      } else {
        return a.description.localeCompare(b.description);
      }
    };

    return html`
      <p>
        This grid sorts items by description using a custom sorter on the data directly (first lowercase and then
        uppercase).
      </p>
      <sl-grid .items=${items}>
        <sl-grid-sort-column path="description" direction="asc" .sorter=${sort}></sl-grid-sort-column>
        <sl-grid-sort-column path="code"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const CustomColumnSorter: Story = {
  render: (_, { loaded: { people } }) => {
    const renderer = ({ firstName, lastName }: Person): TemplateResult => {
      return html`${firstName} ${lastName}`;
    };

    const sorter = (a: Person, b: Person): number => {
      const lastNameCmp = a.lastName.localeCompare(b.lastName);

      if (lastNameCmp === 0) {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return lastNameCmp;
      }
    };

    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column header="User" .renderer=${renderer} .sorter=${sorter}></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const CustomDataSourceSorter: Story = {
  render: (_, { loaded: { people } }) => {
    const sorter = (a: Person, b: Person): number => {
      const lastNameCmp = a.lastName.localeCompare(b.lastName);

      if (lastNameCmp === 0) {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return lastNameCmp;
      }
    };

    const dataSource = new ArrayListDataSource(people as Person[]);
    dataSource.setSort(sorter, 'asc');

    return html`
      <p>This grid sorts people by last name, then first name, via a custom sorter on the data directly.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Grouped: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayListDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column path="id"></sl-grid-sort-column>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};
