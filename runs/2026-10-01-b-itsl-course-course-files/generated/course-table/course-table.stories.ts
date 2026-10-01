import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-itsl-course-table` actually registers — a type-only import
// would be erased at transform time and the element would never be defined.
import './course-table.js';
import { type CourseTable, type CourseTableModel } from './course-table.js';

type Props = Pick<CourseTable, 'model'>;
type Story = StoryObj<Props>;

// In the real app this would come from `sl-itsl-course-files-page`, which owns the fetch for the
// course-files list; this story exercises the component standalone with the design's four
// representative rows.
const model: CourseTableModel = {
  rows: [
    {
      id: 'math-2c-1',
      name: 'Math 2c',
      href: '/courses/math-2c-1/files',
      status: 'archived',
      teacher: 'Floyd Miles and 2 more',
      lastUpdated: '05/04/2024'
    },
    {
      id: 'math-2c-2',
      name: 'Math 2c',
      href: '/courses/math-2c-2/files',
      status: 'deleted',
      teacher: 'Floyd Miles and 2 more',
      lastUpdated: '05/04/2024'
    },
    {
      id: 'math-2c-3',
      name: 'Math 2c',
      href: '/courses/math-2c-3/files',
      status: 'deleted',
      teacher: 'Floyd Miles and 2 more',
      lastUpdated: '05/04/2024'
    },
    {
      id: 'math-2c-4',
      name: 'Math 2c',
      href: '/courses/math-2c-4/files',
      status: 'archived',
      teacher: 'Floyd Miles and 2 more',
      lastUpdated: '05/04/2024'
    }
  ]
};

export default {
  title: 'Runs/B Itsl Course Course Files/Course table',
  args: { model },
  render: ({ model }) => html`<sl-itsl-course-table .model=${model}></sl-itsl-course-table>`
} satisfies Meta<Props>;

export const Basic: Story = {};
