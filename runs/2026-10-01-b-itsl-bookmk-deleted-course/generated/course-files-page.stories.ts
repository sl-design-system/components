import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-course-files-page` actually registers - a type-only import
// would be erased at transform time and the element would never be defined.
import './course-files-page.js';
import { DEFAULT_DATA } from './course-files-page.js';
import { type CourseFile } from './course-files-table/course-files-table.js';

export default {
  title: 'Runs/B Itsl Bookmk Deleted Course/Course files page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-course-files-page></sl-course-files-page>`
} satisfies Meta;

export const Basic: StoryObj = {};

/**
 * No files at all. The table keeps its five column headers and renders an empty body - there is no
 * dedicated empty state. The pager still renders: `pageCount` is floored at 1, so a single "1"
 * button stays visible with both steppers dimmed (aria-disabled, still focusable) and the range
 * status reading "0 to 0 of 0". The design's note "when there is only 1 page, hide the component"
 * is deliberately not implemented. The bulk actions panel is correctly hidden: the root prunes
 * `selectedIds` against `data.files` in `willUpdate`, so an empty file list clears the selection.
 */
export const NoFiles: StoryObj = {
  render: () =>
    html`<sl-course-files-page
      .data=${{ ...DEFAULT_DATA, files: [], totalItems: 0, selectableTotal: 0 }}
    ></sl-course-files-page>`
};

/**
 * A single row - the smallest non-empty table, with the pager down to one page ("1 to 1 of 1").
 * The row is `f1`, which is in the seeded selection, so it renders checked; the bulk bar's count
 * is the design's hard-coded literal, so it reads "2 selected out of 1" here.
 */
export const SingleFile: StoryObj = {
  render: () =>
    html`<sl-course-files-page
      .data=${{
        ...DEFAULT_DATA,
        files: DEFAULT_DATA.files.slice(0, 1),
        totalItems: 1,
        selectableTotal: 1
      }}
    ></sl-course-files-page>`
};

// The ids reuse the seeded selection (`f1`, `f2`) so two of the wrapped rows also show the
// selected-row background. The second title is a single unbroken token - there is no break
// opportunity at all inside it.
const longTitleFiles: CourseFile[] = [
  {
    id: 'f1',
    title:
      'Comparative analysis of nineteenth century Scandinavian social reform movements and ' +
      'their lasting influence on modern welfare policy',
    kind: 'assignment',
    lastUpdated: 'Last updated',
    href: '#'
  },
  {
    id: 'f2',
    title:
      'Sosialkunnskap_9A_vurderingskriterier_og_kjennetegn_paa_maaloppnaaelse_endelig_versjon.docx',
    kind: 'word',
    lastUpdated: 'Last updated 24 September 2026 at 14:32 by Hanna Nilsen',
    href: '#'
  },
  {
    id: 'f3',
    title: 'Group work: sources, method, and the written report (part two of three)',
    kind: 'excel',
    lastUpdated: 'Last updated',
    href: '#'
  }
];

/**
 * Titles far longer than the design's placeholders. The table is `table-layout: fixed` with a 60px
 * select column and the remaining four columns sharing the rest, so the title link has to wrap
 * inside its share - and the unbroken filename in the second row overflows it, because no
 * `overflow-wrap` is set on the title link.
 */
export const LongTitles: StoryObj = {
  render: () =>
    html`<sl-course-files-page
      .data=${{ ...DEFAULT_DATA, files: longTitleFiles, totalItems: 3, selectableTotal: 3 }}
    ></sl-course-files-page>`
};

/**
 * 470 items at the seeded page size of 10, so the pager computes 47 pages and renders a numbered
 * button for every one of them - the design only ever draws 5. There is no truncation or ellipsis,
 * so this shows the page list wrapping across the full width of the card.
 */
export const ManyPages: StoryObj = {
  render: () =>
    html`<sl-course-files-page
      .data=${{ ...DEFAULT_DATA, totalItems: 470 }}
    ></sl-course-files-page>`
};

// `f1` and `f2` are in the component's seeded selection, which keeps the bulk bar's hard-coded
// "2 selected" honest against the two checked rows here.
const allKindFiles: CourseFile[] = [
  {
    id: 'f1',
    title: '[assignment title]',
    kind: 'assignment',
    lastUpdated: 'Last updated',
    href: '#'
  },
  { id: 'f2', title: 'resource title', kind: 'excel', lastUpdated: 'Last updated', href: '#' },
  { id: 'f3', title: 'resource title', kind: 'word', lastUpdated: 'Last updated', href: '#' },
  { id: 'f4', title: 'resource title', kind: 'image', lastUpdated: 'Last updated', href: '#' }
];

/**
 * One row per `CourseFileKind`, so every "Type" label renders: "Assignment", "Excel " (the trailing
 * space is the design's), "Word" and "Image". The 24x24 disc in the title cell is the same neutral
 * placeholder for all four - the design's full-colour product glyphs are remote Figma image assets
 * with no `sl-icon` equivalent, so no kind-specific artwork exists.
 */
export const AllFileKinds: StoryObj = {
  render: () =>
    html`<sl-course-files-page
      .data=${{ ...DEFAULT_DATA, files: allKindFiles, totalItems: 4, selectableTotal: 4 }}
    ></sl-course-files-page>`
};
