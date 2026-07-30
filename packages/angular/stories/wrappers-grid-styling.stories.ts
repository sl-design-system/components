import { GridColumnComponent, GridComponent } from '@sl-design-system/angular/grid';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { html } from 'lit';

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

export const Parts: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    interface StudentWithAverageGrade extends Student {
      averageGrade: number;
    }

    const studentsWithGrades: StudentWithAverageGrade[] = (loaded['students'] as Student[]).map(
      student => ({
        ...student,
        averageGrade: Math.random() * 10
      })
    );

    const ratingFormatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const ratingRenderer = ({ averageGrade }: StudentWithAverageGrade) =>
      html`${ratingFormatter.format(averageGrade)}`;

    const itemParts = ({ averageGrade }: StudentWithAverageGrade): string | undefined => {
      if (averageGrade < 5.5) {
        return 'low-grades';
      } else if (averageGrade > 7.5) {
        return 'high-grades';
      }

      return undefined;
    };

    return {
      description:
        'Use itemParts to assign CSS part names to rows based on row data, then style them with sl-grid::part().',
      props: { studentsWithGrades, ratingRenderer, itemParts },
      template: `
        <style>
          sl-grid::part(thead) {
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
            clip-path: inset(0 0 -10px 0);
          }
          sl-grid::part(row):hover {
            --rating-text-decoration: underline;
          }
          sl-grid::part(data grades) {
            font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
            text-decoration: var(--rating-text-decoration, none);
          }
          sl-grid::part(high-grades) {
            --_body-cell-background: var(--sl-color-background-positive-subtlest);
          }
          sl-grid::part(low-grades) {
            --_body-cell-background: var(--sl-color-background-negative-subtlest);
          }
        </style>
        <sl-grid [items]="studentsWithGrades" [itemParts]="itemParts" [noSkipLinks]="true">
          <sl-grid-column path="studentNumber" header="Nr." [grow]="0"></sl-grid-column>
          <sl-grid-column path="fullName" header="Student" [grow]="3"></sl-grid-column>
          <sl-grid-column
            path="grades"
            header="Rating (0-10)"
            align="end"
            [renderer]="ratingRenderer"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};
