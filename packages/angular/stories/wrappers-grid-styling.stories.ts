import { GridColumnComponent, GridComponent } from '@sl-design-system/angular/grid';
import { getStudents } from '@sl-design-system/example-data';
import type { Student } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid/Styling',
  decorators: [
    moduleMetadata({
      imports: [GridComponent, GridColumnComponent]
    })
  ]
} as Meta;

export const NoBorder: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Hide the outer grid border.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noBorder]="true" [noSkipLinks]="true">
          <sl-grid-column path="id"></sl-grid-column>
          <sl-grid-column path="fullName"></sl-grid-column>
          <sl-grid-column path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const NoRowBorder: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Hide separators between body rows.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noRowBorder]="true" [noSkipLinks]="true">
          <sl-grid-column path="id"></sl-grid-column>
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
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Show alternating row backgrounds for easier scanning.',
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

export const ColumnDivider: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as Student[];

    return {
      description: 'Show vertical separators between columns.',
      props: { students },
      template: `
        <sl-grid [items]="students" [attr.column-divider]="''" [noSkipLinks]="true">
          <sl-grid-column path="id"></sl-grid-column>
          <sl-grid-column path="fullName"></sl-grid-column>
          <sl-grid-column path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
