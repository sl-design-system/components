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

export const Vertical: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 100 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows vertical scrolling with a constrained grid height. The grid will scroll vertically when there are more rows than can fit in the available space.',
      props: { students },
      template: `
        <sl-grid [items]="students" style="block-size: 400px" [noSkipLinks]="true">
          <sl-grid-column path="id" header="Nr."></sl-grid-column>
          <sl-grid-column [grow]="3" path="fullName" header="Student"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="school.name" header="School"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Horizontal: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows horizontal scrolling with a constrained grid width and fixed column widths.',
      props: { students },
      template: `
        <sl-grid [items]="students" style="inline-size: 420px" [noSkipLinks]="true">
          <sl-grid-column path="id" header="Nr." width="140"></sl-grid-column>
          <sl-grid-column path="firstName" header="First name" width="180"></sl-grid-column>
          <sl-grid-column path="lastName" header="Last name" width="180"></sl-grid-column>
          <sl-grid-column path="email" width="280"></sl-grid-column>
          <sl-grid-column path="school.name" header="School" width="200"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Both: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 100 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description:
        'This example shows both vertical and horizontal scrolling with constrained grid dimensions and many columns.',
      props: { students },
      template: `
        <sl-grid [items]="students" style="inline-size: 500px; block-size: 400px" [noSkipLinks]="true">
          <sl-grid-column path="id" header="Nr." width="100"></sl-grid-column>
          <sl-grid-column path="firstName" header="First name" width="150"></sl-grid-column>
          <sl-grid-column path="lastName" header="Last name" width="150"></sl-grid-column>
          <sl-grid-column path="email" width="250"></sl-grid-column>
          <sl-grid-column path="school.name" header="School" width="180"></sl-grid-column>
          <sl-grid-column path="group.name" header="Group" width="150"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
