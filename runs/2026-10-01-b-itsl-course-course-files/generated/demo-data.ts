import { type CourseRow } from './course-table/course-table.js';
import { type PaginationModel } from './pagination-bar/pagination-bar.js';
import { type TopNavModel } from './top-nav/top-nav.js';

/**
 * Demo records for the "Save course materials" screen.
 *
 * In a real application `sl-itsl-course-files-page` would fetch these — one call for the signed-in
 * user's navigation and one paged call for the course list, keyed off `page`/`pageSize`. They live
 * here as plain data so the page renders the design with no arguments.
 */

export const DEMO_NAV: TopNavModel = {
  items: [
    { id: 'courses', label: 'Courses' },
    { id: 'updates', label: 'Updates' },
    { id: 'groups', label: 'Groups' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'library', label: 'Library' }
  ],
  sectionLabel: 'Files',
  tabs: [
    { id: 'your-files', label: 'Your files' },
    { id: 'save-course-materials', label: 'Save course materials' }
  ],
  activeTabId: 'save-course-materials',
  searchPlaceholder: 'Search',
  user: { name: 'Anna Larsen', initials: 'AL' }
};

/**
 * The design draws four identical rows differing only in status. Reproduced verbatim: the
 * screenshot is the pixel ground truth for this run, so the repetition is deliberate and not a
 * placeholder. Note the design also says "1 to 10 of 47" above only four rows — a defect in the
 * design itself, reproduced rather than silently corrected (decomposer OQ-12).
 */
export const DEMO_ROWS: CourseRow[] = [
  { id: 'math-2c-1', name: 'Math 2c', href: '/courses/math-2c/files', status: 'archived', teacher: 'Floyd Miles and 2 more', lastUpdated: '05/04/2024' },
  { id: 'math-2c-2', name: 'Math 2c', href: '/courses/math-2c/files', status: 'deleted', teacher: 'Floyd Miles and 2 more', lastUpdated: '05/04/2024' },
  { id: 'math-2c-3', name: 'Math 2c', href: '/courses/math-2c/files', status: 'deleted', teacher: 'Floyd Miles and 2 more', lastUpdated: '05/04/2024' },
  { id: 'math-2c-4', name: 'Math 2c', href: '/courses/math-2c/files', status: 'archived', teacher: 'Floyd Miles and 2 more', lastUpdated: '05/04/2024' }
];

export const DEMO_PAGINATION: PaginationModel = { page: 1, pageSize: 10, totalItems: 47 };

/** The banner copy, verbatim from the design. */
export const DEMO_BANNER_TEXT =
  "This section contains all the course files you've created or uploaded. Select a course to access its files";

/** The page title, verbatim from the design. */
export const DEMO_PAGE_TITLE = 'Save course materials';
