import {
  GridColumnComponent,
  GridComponent,
  GridSelectionColumnComponent
} from '@sl-design-system/angular/grid';
import { getStudents } from '@sl-design-system/example-data';
import type { Student } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Selection',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, GridSelectionColumnComponent]
    })
  ]
} as Meta;

export const Basic: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Add a selection column and enable multiple row selection.',
      props: { students },
      template: `
        <sl-grid [items]="students" selects="multiple" [noSkipLinks]="true">
          <sl-grid-selection-column></sl-grid-selection-column>
          <sl-grid-column path="id" header="Nr."></sl-grid-column>
          <sl-grid-column path="fullName" header="Student"></sl-grid-column>
          <sl-grid-column path="email" header="Email"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
