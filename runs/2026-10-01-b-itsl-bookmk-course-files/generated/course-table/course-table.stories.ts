import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-itsl-files-course-table` actually registers — a type-only
// import would be erased at transform time and the element would never be defined.
import './course-table.js';
import { type CourseTable, type CourseTableModel } from './course-table.js';

type Props = Pick<CourseTable, 'model'>;
type Story = StoryObj<Props>;

// In the real app this would come from `sl-itsl-files-page`, which owns the fetch for the
// course-files list (`GET /api/courses/files?scope=course-materials`); this story exercises the
// component standalone with the design's four representative rows.
const model: CourseTableModel = {
  rows: [
    {
      id: 'math-2c-1',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-1/files',
      status: 'archived',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    },
    {
      id: 'math-2c-2',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-2/files',
      status: 'deleted',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    },
    {
      id: 'math-2c-3',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-3/files',
      status: 'deleted',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    },
    {
      id: 'math-2c-4',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-4/files',
      status: 'archived',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    }
  ]
};

export default {
  title: 'Runs/B Itsl Bookmk Course Files/Course Table',
  args: { model },
  render: ({ model }) => html`<sl-itsl-files-course-table .model=${model}></sl-itsl-files-course-table>`
} satisfies Meta<Props>;

export const Basic: Story = {};

// The empty state: no course-files rows at all.
const emptyModel: CourseTableModel = { rows: [] };

/** No rows — the empty state: just the header, no body rows. */
export const EmptyRows: Story = {
  args: { model: emptyModel }
};

// A single row, checking the table (and its row/column borders) render sensibly with just one.
const singleRowModel: CourseTableModel = {
  rows: [
    {
      id: 'math-2c-1',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-1/files',
      status: 'archived',
      teacherNames: ['Floyd Miles', 'Jane Cooper', 'Wade Warren'],
      lastUpdatedAt: '2024-04-05'
    }
  ]
};

/** Exactly one row. */
export const SingleRow: Story = {
  args: { model: singleRowModel }
};

// A row with exactly one teacher — `formatTeachers` renders just that name, with no "and N more"
// suffix; the singular case is the one that's easy to get wrong.
const singleTeacherModel: CourseTableModel = {
  rows: [
    {
      id: 'math-2c-5',
      courseName: 'Math 2c',
      courseHref: '/courses/math-2c-5/files',
      status: 'deleted',
      teacherNames: ['Floyd Miles'],
      lastUpdatedAt: '2024-04-05'
    }
  ]
};

/** A row whose `teacherNames` has exactly one entry — no "and N more" suffix. */
export const SingleTeacher: Story = {
  args: { model: singleTeacherModel }
};
