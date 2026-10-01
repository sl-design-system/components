import { type ClassSection } from '../class-nav/class-nav.js';
import { type NavUserModel } from '../global-nav/global-nav.js';
import { type StudentRow } from '../students-panel/students-grid/students-grid.js';

/**
 * The whole page's data, owned by `<sl-a2-class-overview-page>`.
 *
 * In a real app this is what `GET /api/classes/:classId/overview` would return. Here it is a
 * fixture, because the Figma design carries **no domain data at all**: every grid cell reads the
 * literal string `Text`. Inventing student names would be inventing product truth, so the row
 * shape is deliberately the blueprint shape (`column1`..`column4`) rather than a plausible-looking
 * `name`/`email`/`group` schema that the design never specified.
 */
export interface ClassOverviewModel {
  classId: string;
  className: string;
  activeSection: ClassSection;
  classCode: string;
  students: StudentRow[];
  user: NavUserModel;
}

/**
 * The number of data rows the design renders.
 *
 * `get_metadata` reports 23 row instances inside the Figma grid, but 13 of them are
 * `hidden="true"`; the reference screenshot shows exactly 10 data rows of 40px plus a footer.
 * The rendered reference wins — it is the artifact the Stage 4 diff is measured against.
 */
const VISIBLE_ROW_COUNT = 10;

/** The literal placeholder string every one of the design's 40 data cells contains. */
const BLUEPRINT_CELL = 'Text';

/** The ten blueprint rows, every cell carrying the design's literal `Text`. */
export const DEFAULT_STUDENT_ROWS: StudentRow[] = Array.from(
  { length: VISIBLE_ROW_COUNT },
  (_, index) => ({
    id: `row-${index + 1}`,
    column1: BLUEPRINT_CELL,
    column2: BLUEPRINT_CELL,
    column3: BLUEPRINT_CELL,
    column4: BLUEPRINT_CELL
  })
);

/**
 * The signed-in teacher.
 *
 * `pictureUrl` is intentionally left undefined: the design shows a photographic avatar, but this
 * pipeline has no asset-export step, so `<sl-avatar>` falls back to initials rather than pointing
 * at a URL that would 404. Recorded as a Stage 4 discrepancy, not faked.
 */
const DEFAULT_USER: NavUserModel = {
  id: 'u-1',
  displayName: 'Lynn Smith'
};

/** The page's default data, matching the reference frame exactly. */
export const DEFAULT_CLASS_OVERVIEW: ClassOverviewModel = {
  classId: 'c-5a-english',
  className: '5A English',
  activeSection: 'participants',
  classCode: 'D9981',
  students: DEFAULT_STUDENT_ROWS,
  user: DEFAULT_USER
};

/**
 * The seam a real application would replace with a fetch. The root component calls this when no
 * `model` property was supplied, so the page renders the full design with no arguments.
 */
export const loadClassOverview = (classId: string): ClassOverviewModel => ({
  ...DEFAULT_CLASS_OVERVIEW,
  classId: classId || DEFAULT_CLASS_OVERVIEW.classId
});
