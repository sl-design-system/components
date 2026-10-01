import { type CourseTableModel } from './course-table/course-table.js';
import { type SectionNavModel } from './section-nav/section-nav.js';
import { type TopNavModel } from './top-nav/top-nav.js';

/**
 * Demo data for the itslearning "Save course materials" files page, owned by the root
 * `sl-itsl-files-page`.
 *
 * In a real app these would come from itslearning endpoints fetched by the page component:
 * `GET /api/me` (signed-in user for the top nav), `GET /api/tools/files/state` (section-nav
 * state) and `GET /api/courses/files?scope=course-materials` (the table rows) — this pipeline has
 * no network/fetch step, so these are typed mocks standing in for those calls.
 */

/** The signed-in user and active main-menu link shown in the top nav. */
export const DEFAULT_TOP_NAV: TopNavModel = {
  user: { name: 'Jane Doe' },
  activeLinkId: 'courses'
};

/** The "Files" app name and active secondary-nav route. */
export const DEFAULT_SECTION_NAV: SectionNavModel = {
  appName: 'Files',
  activeTabId: 'save-course-materials'
};

/**
 * The course-files table rows. The hidden 5th row (Figma node `4886:12972`) is not implemented —
 * only the four visible rows are reproduced.
 */
export const DEFAULT_COURSE_TABLE: CourseTableModel = {
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

/** The dismissible info banner's body text, reproduced verbatim from the design. */
export const DEFAULT_BANNER_TEXT =
  "This section contains all the course files you've created or uploaded. Select a course to access its files";
