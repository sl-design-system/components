import {
  GridColumnComponent,
  GridColumnGroupComponent,
  GridComponent,
  GridSortColumnComponent
} from '@sl-design-system/angular/grid';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { getStudents } from '@sl-design-system/example-data';
import type { Student } from '@sl-design-system/example-data';
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

    return {
      description: 'Sort columns can also be used inside grouped headers.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-column-group header="Name">
            <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
            <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
          </sl-grid-column-group>
          <sl-grid-sort-column path="id" header="Student number"></sl-grid-sort-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
