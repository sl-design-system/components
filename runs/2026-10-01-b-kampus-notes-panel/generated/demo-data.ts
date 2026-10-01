import { type ChapterHeaderModel } from './chapter-header/kampus-chapter-header.js';
import { type HeaderNavModel } from './header-nav/kampus-header-nav.js';
import { type ToolRailModel } from './left-toolbar/kampus-left-toolbar.js';
import { type NotesPanelModel } from './notes-panel/kampus-notes-panel.js';
import { type SubchapterCardModel } from './subchapter-card/kampus-subchapter-card.js';
import { type ChapterPageData } from './kampus-chapter-page.js';

/**
 * Demo data for the Kampus chapter page, owned by the root `sl-bknp-chapter-page`.
 *
 * In a real app this would come from an endpoint (e.g. `GET /api/chapters/1`) fetched by the page
 * component — this pipeline has no network/fetch step, so these are typed mocks standing in for
 * that call, reproducing the reference design's actual content verbatim (mixed Finnish/English;
 * i18n is off for this run).
 */

/** The global header bar's nav/notification state. */
export const DEFAULT_HEADER_NAV: HeaderNavModel = {
  activeNavId: 'learning-materials',
  notificationCount: 3
};

/** The left tool rail's user photo and badge state. */
export const DEFAULT_TOOL_RAIL: ToolRailModel = {
  userPhotoUrl: '/assets/b-kampus-notes-panel/user-photo.jpg',
  userPhotoAlt: 'The current user’s profile photo',
  activeToolId: 'notes',
  badges: [
    // No count — renders as the bare dot marker.
    { toolId: 'edit-content' },
    { toolId: 'assignments', count: 1 }
  ]
};

/** The chapter header's breadcrumbs, title and chapter-navigation targets. */
export const DEFAULT_CHAPTER_HEADER: ChapterHeaderModel = {
  breadcrumbs: [
    { label: 'Start page', href: '#' },
    // Last crumb is the current page — no href, not a link.
    { label: 'Chapter 1' }
  ],
  title: 'Chapter 1',
  permalinkHref: '#chapter-1',
  previousHref: '#chapter-0',
  nextHref: '#chapter-2'
};

/** The notes panel's two subchapter note groups, reproducing the reference design verbatim. */
export const DEFAULT_NOTES: NotesPanelModel = {
  groups: [
    {
      subchapterId: 'subchapter-1-7',
      label: '1.7 Vastaa kysymyksiin',
      href: '#subchapter-1-7',
      notes: [
        {
          id: 'note-1',
          kind: 'note',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in convallis mauris, quis interdum mi. Sed vulputate nec justo et tincidunt. !!',
          date: '2020-10-14'
        },
        {
          id: 'note-2',
          kind: 'highlight',
          highlightText: 'Dave is reading comic books',
          body: 'This is important.',
          date: '2020-10-14'
        }
      ]
    },
    {
      subchapterId: 'subchapter-2-11',
      label: '2.11 Joku toinen tehtävä',
      href: '#subchapter-2-11',
      notes: [
        {
          id: 'note-3',
          kind: 'highlight',
          highlightText: 'Lorem ipsum lalaaa laa',
          body: 'This will come to the exam.',
          date: '2020-10-19'
        },
        {
          // A highlight with no added comment body — the design shows the marker line alone.
          id: 'note-4',
          kind: 'highlight',
          highlightText: 'Something',
          date: '2020-10-19'
        }
      ]
    }
  ]
};

/**
 * The eight subchapter cards, in display order. `Subchapter 1.2` is the design's only locked
 * card; the rest are available. Cover URLs point at `/assets/...` and 404 in this harness — this
 * pipeline has no asset-export step (see each card's own 404 comment).
 */
export const DEFAULT_SUBCHAPTERS: SubchapterCardModel[] = [
  {
    id: 'subchapter-1-0',
    title: 'Subchapter 1.0',
    href: '#subchapter-1-0',
    coverImageUrl: '/assets/b-kampus-notes-panel/subchapter-1-0.jpg',
    coverImageAlt: 'A man in a black jacket standing with arms crossed, forest in the background',
    locked: false
  },
  {
    id: 'subchapter-1-1',
    title: 'Subchapter 1.1',
    href: '#subchapter-1-1',
    coverImageUrl: '/assets/b-kampus-notes-panel/subchapter-1-1.jpg',
    coverImageAlt: 'Two people relaxing in a hammock strung between trees in a forest',
    locked: false
  },
  {
    id: 'subchapter-1-2',
    title: 'Subchapter 1.2',
    href: '#subchapter-1-2',
    coverImageUrl: '/assets/b-kampus-notes-panel/subchapter-1-2.jpg',
    coverImageAlt: 'A roadside sign welcoming visitors to a graduation programme in several languages',
    // The design's only locked card: dashed border, reduced opacity, no link.
    locked: true
  },
  {
    id: 'subchapter-1-3',
    title: 'Subchapter 1.3',
    href: '#subchapter-1-3',
    coverImageUrl: '/assets/b-kampus-notes-panel/subchapter-1-3.jpg',
    coverImageAlt: 'A performer singing into a microphone on stage under colourful stage lighting',
    locked: false
  },
  {
    id: 'subchapter-1-4',
    title: 'Subchapter 1.4',
    href: '#subchapter-1-4',
    coverImageUrl: '/assets/b-kampus-notes-panel/subchapter-1-4.jpg',
    coverImageAlt: 'Three friends and a dog sitting together on a bench outdoors',
    locked: false
  },
  {
    id: 'subchapter-1-5',
    title: 'Subchapter 1.5',
    href: '#subchapter-1-5',
    coverImageUrl: '/assets/b-kampus-notes-panel/subchapter-1-5.jpg',
    coverImageAlt: 'A child in a yellow raincoat jumping in a puddle',
    locked: false
  },
  {
    id: 'subchapter-1-6',
    title: 'Subchapter 1.6',
    href: '#subchapter-1-6',
    coverImageUrl: '/assets/b-kampus-notes-panel/subchapter-1-6.jpg',
    coverImageAlt: 'Subchapter 1.6 cover photo',
    locked: false
  },
  {
    id: 'subchapter-1-7',
    title: 'Subchapter 1.7',
    href: '#subchapter-1-7',
    coverImageUrl: '/assets/b-kampus-notes-panel/subchapter-1-7.jpg',
    coverImageAlt: 'Subchapter 1.7 cover photo',
    locked: false
  }
];

/** The full default dataset for `sl-bknp-chapter-page`, rendering the reference design verbatim. */
export const DEFAULT_CHAPTER_PAGE_DATA: ChapterPageData = {
  headerNav: DEFAULT_HEADER_NAV,
  toolRail: DEFAULT_TOOL_RAIL,
  chapterHeader: DEFAULT_CHAPTER_HEADER,
  notes: DEFAULT_NOTES,
  subchapters: DEFAULT_SUBCHAPTERS
};
