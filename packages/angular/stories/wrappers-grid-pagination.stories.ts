import { CommonModule } from '@angular/common';
import {
  GridColumnComponent,
  GridComponent,
  GridFilterColumnComponent
} from '@sl-design-system/angular/grid';
import {
  PaginatorComponent,
  PaginatorPageSizeComponent,
  PaginatorStatusComponent
} from '@sl-design-system/angular/paginator';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';

export default {
  title: 'Wrappers/Grid/Pagination',
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        GridComponent,
        GridColumnComponent,
        PaginatorComponent,
        PaginatorStatusComponent,
        PaginatorPageSizeComponent,
        GridFilterColumnComponent
      ]
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
      props: {
        ds: new ArrayListDataSource(students, {
          pagination: true,
          page: 0,
          pageSize: 10
        }),
        pageSizes: [5, 10, 15, 20]
      },
      template: `
        <style>
          .pagination {
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-block: 1rem;
            justify-content: space-between;
          }
          sl-paginator {
            flex: 1;
            justify-content: center;
          }
        </style>
          <sl-grid [dataSource]="ds" [noSkipLinks]="true">
            <sl-grid-column path="id" header="Nr."></sl-grid-column>
            <sl-grid-column path="fullName" header="Student"></sl-grid-column>
            <sl-grid-column path="school.name" header="School"></sl-grid-column>
          </sl-grid>
        <div class="pagination">
          <sl-paginator-status [dataSource]="ds" itemLabel="students"></sl-paginator-status>
          <sl-paginator [dataSource]="ds"></sl-paginator>
          <sl-paginator-page-size [dataSource]="ds" itemLabel="Students" [pageSizes]="pageSizes"></sl-paginator-page-size>
        </div>
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
    const ds = new ArrayListDataSource(students, {
      filters: [
        {
          id: 'filter-school',
          by: 'school.id',
          value: 'school-1'
        }
      ],
      pagination: true,
      page: 0,
      pageSize: 10
    });

    return {
      description:
        'This example shows how filtering and pagination work together. Page size is adjusted automatically based on filtered results.',
      props: { ds, pageSizes: [5, 10, 15, 20] },
      template: `
        <style>
          .pagination {
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-block: 1rem;
            justify-content: space-between;
          }
          sl-paginator {
            flex: 1;
            justify-content: center;
          }
        </style>
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-filter-column path="fullName" header="Student"></sl-grid-filter-column>
          <sl-grid-filter-column path="school.name" header="School" mode="select" labelPath="school.name"></sl-grid-filter-column>
          <sl-grid-column path="email"></sl-grid-column>
        </sl-grid>
        <div class="pagination">
          <sl-paginator-status [dataSource]="ds" itemLabel="students"></sl-paginator-status>
          <sl-paginator [dataSource]="ds"></sl-paginator>
          <sl-paginator-page-size [dataSource]="ds" itemLabel="Students" [pageSizes]="pageSizes"></sl-paginator-page-size>
        </div>
      `
    };
  }
};
