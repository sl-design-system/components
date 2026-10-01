import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Importing the component registers `sl-bknp-chapter-page` globally (guarded) as a side effect.
// A `import { type … }` here would be erased at compile time, the module would never run, and
// `customElements.define` would never happen — the type check passes either way.
import './kampus-chapter-page.js';
import { type ChapterPageData } from './kampus-chapter-page.js';
import { DEFAULT_CHAPTER_PAGE_DATA } from './demo-data.js';

type Story = StoryObj;

/** Derive a variant from the default data without mutating the shared constant. */
const withData = (patch: Partial<ChapterPageData>) => {
  const data: ChapterPageData = { ...DEFAULT_CHAPTER_PAGE_DATA, ...patch };

  return html`<sl-bknp-chapter-page .data=${data}></sl-bknp-chapter-page>`;
};

export default {
  title: 'Runs/B Kampus Notes Panel/Chapter page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-bknp-chapter-page></sl-bknp-chapter-page>`
} satisfies Meta;

/** The design as drawn: notes panel open with two note groups, eight subchapter cards. */
export const Basic: Story = {};

/**
 * No notes saved yet. Exercises the notes panel with an empty `groups` array — the state a
 * student sees before highlighting anything. The design's own empty-state copy lives in a hidden
 * Figma variant that this run did not implement, so the panel simply renders its header and
 * filters over an empty list.
 */
export const NoNotes: Story = {
  render: () => withData({ notes: { groups: [] } })
};

/** A single note group, so the 24px inter-group gap is absent and the list is short. */
export const SingleNoteGroup: Story = {
  render: () =>
    withData({ notes: { groups: DEFAULT_CHAPTER_PAGE_DATA.notes.groups.slice(0, 1) } })
};

/**
 * Nothing needs attention: no unread notifications in the header and no badges on the tool rail.
 * `notificationCount: 0` is the documented way to suppress the header badge.
 */
export const NothingPending: Story = {
  render: () =>
    withData({
      headerNav: { ...DEFAULT_CHAPTER_PAGE_DATA.headerNav, notificationCount: 0 },
      toolRail: { ...DEFAULT_CHAPTER_PAGE_DATA.toolRail, badges: [] }
    })
};

/** Every subchapter unlocked — the grid with no dashed/dimmed card. */
export const NoLockedSubchapters: Story = {
  render: () =>
    withData({
      subchapters: DEFAULT_CHAPTER_PAGE_DATA.subchapters.map(s => ({ ...s, locked: false }))
    })
};

/** Every subchapter locked — the dashed, dimmed variant repeated across the whole grid. */
export const AllSubchaptersLocked: Story = {
  render: () =>
    withData({
      subchapters: DEFAULT_CHAPTER_PAGE_DATA.subchapters.map(s => ({ ...s, locked: true }))
    })
};

/**
 * A deeper breadcrumb trail than the design shows. `sl-breadcrumbs` has a built-in collapse
 * behaviour that folds middle crumbs into a popover past a width threshold, so this story is the
 * one that exercises it — worth keeping, because the collapse is the component's own behaviour
 * and not something this run controls.
 */
export const DeepBreadcrumb: Story = {
  render: () =>
    withData({
      chapterHeader: {
        ...DEFAULT_CHAPTER_PAGE_DATA.chapterHeader,
        breadcrumbs: [
          { label: 'Start page', href: '#' },
          { label: 'Learning materials', href: '#' },
          { label: 'Elements basics', href: '#' },
          { label: 'Part 2', href: '#' },
          { label: 'Chapter 1' }
        ]
      }
    })
};
