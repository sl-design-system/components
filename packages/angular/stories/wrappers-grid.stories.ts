import {
  GridColumnComponent,
  GridColumnGroupComponent,
  GridComponent
} from '@sl-design-system/angular/grid';
import { getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

type Student = Awaited<ReturnType<typeof getStudents>>['students'][number];

export default {
  title: 'Wrappers/Grid/Basics',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent, GridColumnGroupComponent]
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
        'A grid displays tabular data in rows and columns. This example shows a basic setup with static data and simple columns.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-column [grow]="0" header="Nr." path="id"></sl-grid-column>
          <sl-grid-column [grow]="3" header="Student" path="fullName"></sl-grid-column>
          <sl-grid-column header="Date of birth" path="dateOfBirth"></sl-grid-column>
          <sl-grid-column header="School" path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const ColumnGroups: StoryObj = {
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
        'You can group related columns by using sl-grid-column-group for clearer table structure.',
      props: { students },
      template: `
        <sl-grid [items]="students" [striped]="true" [noSkipLinks]="true">
          <sl-grid-column-group header="Name">
            <sl-grid-column path="firstName"></sl-grid-column>
            <sl-grid-column path="lastName"></sl-grid-column>
          </sl-grid-column-group>
          <sl-grid-column-group header="School">
            <sl-grid-column path="school.name"></sl-grid-column>
            <sl-grid-column path="school.city"></sl-grid-column>
          </sl-grid-column-group>
        </sl-grid>
      `
    };
  }
};

export const Header: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Customize column header labels by setting the header attribute per column.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-column header="Student number" path="id"></sl-grid-column>
          <sl-grid-column header="Student name" path="fullName"></sl-grid-column>
          <sl-grid-column header="Birth date" path="dateOfBirth"></sl-grid-column>
          <sl-grid-column header="School name" path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const EllipsizeText: StoryObj = {
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
        'Use ellipsize-text to truncate long text values while keeping columns compact and readable.',
      props: { students },
      template: `
        <sl-grid
          [items]="students"
          [ellipsizeText]="true"
          [noSkipLinks]="true"
          style="max-inline-size: 700px">
          <sl-grid-column path="fullName"></sl-grid-column>
          <sl-grid-column path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Striped: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Use striped rows to improve readability in larger datasets.',
      props: { students },
      template: `
        <sl-grid [items]="students" [striped]="true" [noSkipLinks]="true">
          <sl-grid-column path="id"></sl-grid-column>
          <sl-grid-column path="fullName"></sl-grid-column>
          <sl-grid-column path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
