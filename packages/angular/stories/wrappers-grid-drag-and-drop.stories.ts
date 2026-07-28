import {
  GridColumnComponent,
  GridComponent,
  GridDragHandleColumnComponent
} from '@sl-design-system/angular/grid';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Drag and drop',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, GridDragHandleColumnComponent]
    })
  ]
} as Meta;

export const Basic: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 20 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Enable row reordering with a drag handle column.',
      props: { students },
      template: `
        <sl-grid [items]="students" [draggableRows]="true" [noSkipLinks]="true">
          <sl-grid-drag-handle-column header="Drag"></sl-grid-drag-handle-column>
          <sl-grid-column path="id" header="Nr."></sl-grid-column>
          <sl-grid-column path="fullName" header="Student"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
