import { type AppBarModel } from './app-bar/a3mp-app-bar.js';
import { type ChapterHeaderModel } from './chapter-header/a3mp-chapter-header-card.js';
import { type ChapterNavModel } from './chapter-nav/a3mp-chapter-nav-column.js';
import { type ExercisesPanelModel } from './exercises-panel/a3mp-exercises-panel.js';
import { type QuickActionsModel } from './quick-actions-bar/a3mp-quick-actions-bar.js';
import { type SideNavModel } from './side-nav/a3mp-side-nav.js';

/**
 * The page's data, as drawn in the Figma frame. In a real application this is what a fetch would
 * return; here it is a constant so the story renders the design with no arguments.
 *
 * i18n is OFF for this run, so the strings are kept verbatim from the design — including the Dutch
 * content ("Uitgeverij VAN IN", "Instructiefilmpje hoofdletter...") alongside the English chrome.
 * That mix is what the design shows.
 */
export interface DigitalExercisesPageData {
  /** The dark-blue top bar. */
  appBar: AppBarModel;
  /** The white quick-actions strip below it. */
  quickActions: QuickActionsModel;
  /** The 240px primary navigation column. */
  sideNav: SideNavModel;
  /** The breadcrumb trail, in order; the last entry is the current page. */
  breadcrumbs: Array<{ id: string; label: string }>;
  /** The book/method header card. */
  chapterHeader: ChapterHeaderModel;
  /** The left chapter navigation column. */
  chapterNav: ChapterNavModel;
  /** The right exercises panel. */
  exercisesPanel: ExercisesPanelModel;
}

/** The four exercise blocks share their title and meta; only row 1 carries the MAX badge. */
const exerciseBase = {
  source: 'Reken Maar! 2 | Blok 2',
  title: 'Instructiefilmpje hoofdletter w long name would look like',
  typeKeys: ['Single choice', 'Multi choice', 'Drag and drop'],
  durationSeconds: 45,
  exerciseCount: 1,
  added: false
};

/** The page exactly as the design draws it. */
export const DEFAULT_PAGE_DATA: DigitalExercisesPageData = {
  appBar: {
    classLabel: '4A',
    schoolLabel: 'Basisschool 1234',
    user: { displayName: 'Anna Nowak', initials: 'AN' },
    hasNotifications: true
  },
  quickActions: {
    leadLabel: 'Quick actions:',
    actions: [
      { id: 'new-task', label: 'New task' },
      { id: 'give-feedback', label: 'Give Feedback' },
      { id: 'new-care-note', label: 'New care note' },
      { id: 'view-island', label: 'View island' }
    ]
  },
  sideNav: {
    items: [
      { id: 'home', label: 'Home', selected: true },
      { id: 'planner', label: 'Planner', selected: false },
      { id: 'class', label: 'Class', selected: false },
      { id: 'tasks', label: 'Tasks', selected: false },
      { id: 'evaluation', label: 'Evaluation', selected: false },
      { id: 'analytics', label: 'Analytics', selected: false },
      { id: 'administration', label: 'Administration', selected: false }
    ],
    collapseLabel: 'Miniaturize'
  },
  breadcrumbs: [
    { id: 'home', label: 'Home' },
    { id: 'chapter', label: 'TaalTijd voor Taal accent - 4 (Chapter 3)' }
  ],
  chapterHeader: {
    title: 'Reken Maar! 4',
    publisher: 'Uitgeverij VAN IN',
    methodCode: 'LO-J4',
    // No asset-export step exists in this pipeline, so this 404s by design. The <img> carries
    // explicit dimensions so the 404 does not reflow the layout.
    coverSrc: '/assets/a3mp/reken-maar-4-cover.png',
    coverAlt: 'Cover of Reken Maar! 4',
    actions: [
      { id: 'digiboardware', label: 'Digiboardware', primary: true },
      { id: 'lorem-ipsum', label: 'Lorem Ipsum', primary: false }
    ],
    clusters: [
      {
        id: 'administrator',
        members: [{ initials: 'DK', displayName: 'Daniele King' }],
        overflowCount: 0,
        summary: 'Daniele King',
        roleLabel: 'Administrator'
      },
      {
        id: 'co-authors',
        members: [
          { initials: 'JV', displayName: 'Jan Valeero' },
          { initials: 'DK', displayName: 'Daniele King' }
        ],
        overflowCount: 0,
        summary: 'Jan Valeero, Daniele King',
        roleLabel: 'Co-authors (2)'
      },
      {
        id: 'with-own-copy',
        members: [
          { initials: 'JV', displayName: 'Jan Valeero' },
          { initials: 'DK', displayName: 'Daniele King' },
          { initials: 'KW', displayName: 'Karl Watson' }
        ],
        overflowCount: 2,
        summary: 'Jan Valeero, Daniele King, Karl Watson and 2 others',
        roleLabel: 'With own copy (5)'
      }
    ]
  },
  chapterNav: {
    searchPlaceholder: 'Search by name',
    chapters: [
      { id: 'materials', label: 'Materials', expanded: false, highlighted: false, leaves: [] },
      { id: 'tests', label: 'Tests', expanded: false, highlighted: false, leaves: [] },
      { id: 'chapter-1', label: 'Chapter 1', expanded: false, highlighted: false, leaves: [] },
      {
        id: 'chapter-2',
        label: 'Chapter 2',
        expanded: true,
        highlighted: true,
        leaves: [
          { id: 'lessons', label: 'Lessons', count: 10, selected: false },
          { id: 'digital-exercises', label: 'Digital Exercises', count: 6, selected: true },
          { id: 'print-exercises', label: 'Print Exercises', count: 5, selected: false },
          { id: 'chapter-tests', label: 'Tests', count: 5, selected: false }
        ]
      },
      { id: 'chapter-3', label: 'Chapter 3', expanded: false, highlighted: false, leaves: [] },
      { id: 'chapter-4', label: 'Chapter 4', expanded: false, highlighted: false, leaves: [] }
    ]
  },
  exercisesPanel: {
    heading: 'Digital Exercises',
    levelLabel: 'Exercises level',
    selectedLevelId: 'show-all',
    levels: [
      { id: 'show-all', label: 'Show all', disabled: false },
      { id: 'regular', label: 'Regular', disabled: false },
      { id: 'differentiation', label: 'Differentiation', disabled: true },
      { id: 'remediation', label: 'Remediation', disabled: true },
      { id: 'enrichment', label: 'Enrichment', disabled: true }
    ],
    exercises: [
      { ...exerciseBase, id: 'ex-1', level: 'max', position: 1, total: 4 },
      { ...exerciseBase, id: 'ex-2', position: 2, total: 4 },
      { ...exerciseBase, id: 'ex-3', position: 3, total: 4 },
      { ...exerciseBase, id: 'ex-4', position: 4, total: 4 }
    ]
  }
};
