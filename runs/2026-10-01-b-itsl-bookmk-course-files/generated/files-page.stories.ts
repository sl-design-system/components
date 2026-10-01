import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-itsl-files-page` globally (guarded). A `type`-only
// import here would be erased at transform time and the element would never be defined, leaving
// an unregistered 0x0 element in the story.
import './files-page.js';
import { type CourseTableModel } from './course-table/course-table.js';
import { DEFAULT_SECTION_NAV } from './demo-data.js';
import { type SectionNavModel } from './section-nav/section-nav.js';

type Story = StoryObj;

export default {
  title: 'Runs/B Itsl Bookmk Course Files/Files Page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-itsl-files-page></sl-itsl-files-page>`
} satisfies Meta;

export const Basic: Story = {};

/** No `bannerText` — the card closes up cleanly with the table flush against the top padding. */
export const NoBanner: Story = {
  render: () => html`<sl-itsl-files-page .bannerText=${undefined}></sl-itsl-files-page>`
};

// No rows at all — what the page looks like before any course files exist.
const emptyCourseTable: CourseTableModel = { rows: [] };

/** An empty course table: no data, just the column headers. */
export const EmptyCourseTable: Story = {
  render: () => html`<sl-itsl-files-page .courseTable=${emptyCourseTable}></sl-itsl-files-page>`
};

// Long enough to wrap within the `<h1>`'s 800px `max-inline-size`, pinning the wrapping behaviour.
const longHeading =
  'Save course materials for all of your active and archived courses across every term this year';

/** A much longer page title, pinning the `<h1>`'s 800px max-width wrapping behaviour. */
export const LongHeading: Story = {
  render: () => html`<sl-itsl-files-page heading=${longHeading}></sl-itsl-files-page>`
};

// Moves the section-nav's active-tab underline from "Save course materials" to "Your files"; the
// page title itself is unaffected (it's a separate `heading` prop), so it still reads the same.
const yourFilesSectionNav: SectionNavModel = { ...DEFAULT_SECTION_NAV, activeTabId: 'your-files' };

/** The section-nav's active tab is "Your files" instead of the default "Save course materials". */
export const DifferentActiveTab: Story = {
  render: () => html`<sl-itsl-files-page .sectionNav=${yourFilesSectionNav}></sl-itsl-files-page>`
};
