import {
  GridColumnComponent,
  GridComponent,
  GridFilterColumnComponent
} from '@sl-design-system/angular/grid';
import { PaginatorComponent } from '@sl-design-system/angular/paginator';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { getStudents } from '@sl-design-system/example-data';
import type { Student } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Pagination',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, PaginatorComponent, GridFilterColumnComponent]
    })
  ]
} as Meta;

export const Basic: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'Connect a paginator to the same data source as the grid to paginate through all items.',
      props: { ds: new ArrayListDataSource(students), pageSizes: [5, 10, 25] },
      template: `
          <sl-grid [dataSource]="ds" [noSkipLinks]="true">
            <sl-grid-column path="id" header="Nr."></sl-grid-column>
            <sl-grid-column path="fullName" header="Student"></sl-grid-column>
            <sl-grid-column path="school.name" header="School"></sl-grid-column>
          </sl-grid>
          <sl-paginator [dataSource]="ds" pageSize="10" [pageSizes]="pageSizes"></sl-paginator>
        `
    };
  }
};

export const Filtering: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];
    const ds = new ArrayListDataSource(students);

    return {
      description:
        'This example shows how filtering and pagination work together. Page size is adjusted automatically based on filtered results.',
      props: { ds, pageSizes: [5, 10, 25] },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-filter-column path="fullName" header="Student"></sl-grid-filter-column>
          <sl-grid-filter-column path="school.name" header="School" mode="select" labelPath="school.name"></sl-grid-filter-column>
          <sl-grid-column path="email"></sl-grid-column>
        </sl-grid>
        <sl-paginator [dataSource]="ds" pageSize="10" [pageSizes]="pageSizes"></sl-paginator>
      `
    };
  }
};
