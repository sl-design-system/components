import { GridColumnComponent, GridComponent } from '@sl-design-system/angular/grid';
import { getStudents } from '@sl-design-system/example-data';
import type { Student } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Scrolling',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent]
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
      description: 'This example shows horizontal scrolling with a constrained grid width.',
      props: { students },
      template: `
        <sl-grid [items]="students" style="inline-size: 420px" [noSkipLinks]="true">
          <sl-grid-column path="id" width="140"></sl-grid-column>
          <sl-grid-column path="firstName" width="180"></sl-grid-column>
          <sl-grid-column path="lastName" width="180"></sl-grid-column>
          <sl-grid-column path="email" width="280"></sl-grid-column>
          <sl-grid-column path="school.name" width="200"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
