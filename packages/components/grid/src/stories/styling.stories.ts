import { Avatar } from '@sl-design-system/avatar';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../register.js';
import { type GridColumnDataRenderer } from '../column.js';
import { type GridItemParts } from '../grid.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Styling',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
} satisfies Meta;

export const NoBorder: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows a grid with the <code>no-border</code> attribute. This removes the outer borders of the grid.
      You can use this if you want to embed the grid in a card or other container. The grid will still have inner
      borders, for example between the header and body.
    </p>
    <sl-grid .items=${students} no-border>
      <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
      <sl-grid-column
        grow="3"
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}
      ></sl-grid-column>
      <sl-grid-column header="School" path="school.name"></sl-grid-column>
    </sl-grid>
  `
};

export const NoRowBorder: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This examples shows a grid with the <code>no-row-border</code> attribute. This removes the borders between the
      rows in the grid.
    </p>
    <sl-grid .items=${students} no-row-border>
      <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
      <sl-grid-column
        grow="3"
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}
      ></sl-grid-column>
      <sl-grid-column header="School" path="school.name"></sl-grid-column>
    </sl-grid>
  `
};

export const Striped: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>This example shows a grid with striped rows. The background color of the rows alternates between two colors.</p>
    <sl-grid .items=${students} striped>
      <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
      <sl-grid-column
        grow="3"
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}
      ></sl-grid-column>
      <sl-grid-column header="School" path="school.name"></sl-grid-column>
    </sl-grid>
  `
};

export const ColumnDivider: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows a grid with the <code>column-divider</code> attribute. This causes a visual divider to be
      displayed between the columns.
    </p>
    <sl-grid .items=${students} column-divider>
      <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
      <sl-grid-column
        grow="3"
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}
      ></sl-grid-column>
      <sl-grid-column header="School" path="school.name"></sl-grid-column>
    </sl-grid>
  `
};

export const Parts: Story = {
  render: (_, { loaded: { students } }) => {
    interface StudentWithAverageGrade extends Student {
      averageGrade: number;
    }

    const studentsWithGrades: StudentWithAverageGrade[] = (students as Student[]).map(student => ({
        ...student,
        averageGrade: Math.random() * 10
      })),
      ratingFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const ratingRenderer: GridColumnDataRenderer<StudentWithAverageGrade> = ({ averageGrade }) => {
      return html`${ratingFormatter.format(averageGrade)}`;
    };

    const studentParts: GridItemParts<StudentWithAverageGrade> = ({ averageGrade }) => {
      if (averageGrade < 5.5) {
        return 'low-grades';
      } else if (averageGrade > 7.5) {
        return 'high-grades';
      }

      return undefined;
    };

    return html`
      <style>
        sl-grid::part(thead) {
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
          clip-path: inset(0 0 -10px 0);
        }
        sl-grid::part(row):hover {
          --rating-text-decoration: underline;
        }
        sl-grid::part(data grades) {
          font-weight: var(--sl-text-typeset-fontWeight-demibold);
          text-decoration: var(--rating-text-decoration, none);
        }
        sl-grid::part(high-grades) {
          --_body-cell-background: var(--sl-color-background-positive-subtlest);
        }
        sl-grid::part(low-grades) {
          --_body-cell-background: var(--sl-color-background-negative-subtlest);
        }
      </style>
      <p>
        This example shows how you can customize the rendering of the grid by using CSS parts. This is a combination of
        the <code>itemParts</code> property on <code>sl-grid</code> to customize the parts of <code>tr</code> elements
        and the CSS parts on <code>td</code> elements. A column automatically gets a part name based on the
        <code>path</code> property of the column. In this case, the column with the path <code>grades</code> will get
        the part name <code>grades</code>. You can customize this further by setting the <code>parts</code> property on
        the column.
      </p>
      <p>
        The <code>itemParts</code> property is a function that returns part names based on the student. In this case,
        the part name is based on the average grade of the student. The part names are used to set the background color
        of the row. The <code>high-grades</code> part is used for students with an average grade of 7.5 or higher. The
        <code>low-grades</code> part is used for students with an average grade of 5.5 or lower.
      </p>
      <sl-grid .items=${studentsWithGrades} .itemParts=${studentParts}>
        <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
        <sl-grid-column
          grow="3"
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column align="end" header="Rating (0-10)" path="grades" .renderer=${ratingRenderer}></sl-grid-column>
      </sl-grid>
    `;
  }
};
