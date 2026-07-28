import {
  GridColumnComponent,
  GridComponent,
  GridFilterColumnComponent
} from '@sl-design-system/angular/grid';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Filtering',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, GridFilterColumnComponent]
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
      description: 'Filter by free text and by select options using filter columns.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-filter-column path="fullName" header="Student"></sl-grid-filter-column>
          <sl-grid-filter-column path="group.name" header="Group"></sl-grid-filter-column>
          <sl-grid-filter-column
            path="school.id"
            header="School"
            label-path="school.name"
            mode="select"></sl-grid-filter-column>
        </sl-grid>
      `
    };
  }
};
