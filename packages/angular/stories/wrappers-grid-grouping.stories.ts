import {
  GridColumnComponent,
  GridColumnGroupComponent,
  GridComponent
} from '@sl-design-system/angular/grid';
import { getStudents } from '@sl-design-system/example-data';
import type { Student } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Grouping',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, GridColumnGroupComponent]
    })
  ]
} as Meta;

export const Grouped: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Group related columns under shared headers for better structure.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-column-group header="Student">
            <sl-grid-column path="id" header="Nr."></sl-grid-column>
            <sl-grid-column path="firstName" header="First name"></sl-grid-column>
            <sl-grid-column path="lastName" header="Last name"></sl-grid-column>
          </sl-grid-column-group>
          <sl-grid-column-group header="School">
            <sl-grid-column path="school.name" header="Name"></sl-grid-column>
            <sl-grid-column path="school.city" header="City"></sl-grid-column>
          </sl-grid-column-group>
        </sl-grid>
      `
    };
  }
};
