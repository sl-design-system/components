/**
 * Shared contracts for the B-Sesame "Group details" run (Figma `2142:48093`).
 *
 * This module lives at the run root and **imports nothing**, so it cannot participate in an import
 * cycle. The root component imports its children, so a child importing a model back from the root
 * would close a loop — the sibling run A11 hit exactly that. A4 instead exported each model from
 * the child that consumes it, which works but scatters one contract across five files; two of the
 * models below (`StudentDraft`, `GradeLevel` values) are consumed by two different children, so
 * that shape does not fit here.
 *
 * Every field is domain data or a stable key. No translated strings and no structural config —
 * the nav items, the tab set, the legal links and the grade-level option list are constants inside
 * the components that render them.
 */

/** Stable key for a top-level navigation destination. */
export type NavId = 'learning-materials' | 'groups' | 'users' | 'licenses';

/** Stable key for one of the page's three tabs. */
export type TabId = 'students' | 'teachers' | 'licenses';

/** Which sign-in scheme a new student gets. */
export type LoginType = 'easy' | 'regular';

/** Stable key for one of the three editable group-detail rows. */
export type GroupDetailFieldId = 'name' | 'schoolYear' | 'type';

/** The signed-in user, as the app header renders them. */
export interface AppHeaderUser {
  /** Full name, shown beside the avatar. */
  name: string;
  /**
   * The avatar's initials. Carried as data rather than derived from `name`, because the design
   * renders "EM" for "Anna Magiera" — see the run's OQ-4.
   */
  initials: string;
  /** The user's role at the active school, shown as the avatar subheader. */
  role: string;
}

export interface AppHeaderModel {
  /** Product wordmark. Rendered as text — the logo asset has no export step (OQ-6). */
  brandName: string;
  /** Which navigation item is current. */
  activeNavId: NavId;
  user: AppHeaderUser;
  school: { id: string; name: string };
}

/** One label/value row of the group summary, with an inline edit affordance. */
export interface GroupDetailField {
  id: GroupDetailFieldId;
  /** Per-record label text supplied by the data source, so it is rendered directly. */
  label: string;
  value: string;
}

export interface GroupSummaryModel {
  groupId: string;
  fields: GroupDetailField[];
  /** The code a student enters to join the group, e.g. `AB3FRR`. */
  linkingCode: string;
  canArchive: boolean;
}

/** The four search inputs of the "Add student to group" panel. */
export interface StudentSearchValue {
  firstName: string;
  lastName: string;
  email: string;
  /** Empty string means nothing is selected yet. */
  gradeLevel: string;
}

export interface StudentSearchModel {
  value: StudentSearchValue;
  /** How many school records matched. Zero renders the no-results box. */
  resultCount: number;
}

/** The new student being created, as the create form holds them. */
export interface StudentDraft {
  firstName: string;
  lastName: string;
  gradeLevel: string;
  loginType: LoginType;
  email: string;
  username: string;
}

export interface CreateStudentModel {
  draft: StudentDraft;
  /** Whether the form stays open for another student after submitting. */
  createAnother: boolean;
}

export interface AppFooterModel {
  /** The organisation named beside the footer wordmark. */
  organisationName: string;
}
