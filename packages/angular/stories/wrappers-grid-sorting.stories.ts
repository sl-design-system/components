import {
  GridColumnComponent,
  GridColumnGroupComponent,
  GridComponent,
  GridSortColumnComponent
} from '@sl-design-system/angular/grid';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Sorting',
  decorators: [
    moduleMetadata({
      imports: [
        GridComponent,
        GridColumnComponent,
        GridColumnGroupComponent,
        GridSortColumnComponent
      ]
    })
  ]
} as Meta;

export const Basic: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 40 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Use sort columns to let users sort rows by one or more fields.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-sort-column path="id" header="Nr."></sl-grid-sort-column>
          <sl-grid-sort-column path="firstName" header="First name"></sl-grid-sort-column>
          <sl-grid-sort-column path="lastName" header="Last name"></sl-grid-sort-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const DataSource: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 40 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Sorting also works when the grid uses a data source.',
      props: { ds: new ArrayListDataSource(students) },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-sort-column path="id" header="Nr."></sl-grid-sort-column>
          <sl-grid-sort-column path="firstName" header="First name"></sl-grid-sort-column>
          <sl-grid-sort-column path="lastName" header="Last name"></sl-grid-sort-column>
        </sl-grid>
      `
    };
  }
};

export const CustomSorter: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 40 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Provide a custom sorter function for specific sort behavior.',
      props: {
        students,
        sortByNameLength: (a: { firstName: string }, b: { firstName: string }) =>
          a.firstName.length - b.firstName.length
      },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-sort-column
            path="firstName"
            header="First name length"
            [sorter]="sortByNameLength"></sl-grid-sort-column>
          <sl-grid-column path="lastName" header="Last name"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Grouped: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 40 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    const ds = new ArrayListDataSource(students, {
      groupBy: 'school.id',
      groupLabelPath: 'school.name',
      groupSortDirection: 'desc'
    });

    return {
      description:
        'This example shows how sorting works in combination with grouping. Groups are sorted by their labels in descending order. Within the groups, students are sorted by name in ascending order.',
      props: { ds },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-sort-column path="studentNumber" header="Nr." [grow]="0"></sl-grid-sort-column>
          <sl-grid-sort-column path="fullName" header="Student" direction="asc" [grow]="3"></sl-grid-sort-column>
          <sl-grid-column path="email"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
