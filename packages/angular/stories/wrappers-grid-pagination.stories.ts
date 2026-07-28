import { GridColumnComponent, GridComponent } from '@sl-design-system/angular/grid';
import { PaginatorComponent } from '@sl-design-system/angular/paginator';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { getStudents } from '@sl-design-system/example-data';
import type { Student } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Pagination',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, PaginatorComponent]
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
      description: 'Connect a paginator to the same data source as the grid.',
      props: { ds: new ArrayListDataSource(students) },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-column path="id" header="Nr."></sl-grid-column>
          <sl-grid-column path="fullName" header="Student"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
        <sl-paginator [dataSource]="ds" page-size="10" page-sizes="5,10,25"></sl-paginator>
      `
    };
  }
};
