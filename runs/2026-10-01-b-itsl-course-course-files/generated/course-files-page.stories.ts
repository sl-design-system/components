import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-itsl-course-files-page` actually registers. A type-only import
// is erased at transform time and `customElements.define` would never run.
import './course-files-page.js';
import { type CourseFilesPage } from './course-files-page.js';
import { DEMO_BANNER_TEXT, DEMO_NAV, DEMO_PAGE_TITLE, DEMO_ROWS } from './demo-data.js';

type Props = Pick<CourseFilesPage, 'data'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/B Itsl Course Course Files/Course files page',
  // Storybook's default canvas padding (16px) would inset the page and shrink the 1184px content
  // column to 1152px. This is a full-bleed product screen, so it owns the whole canvas.
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-itsl-course-files-page></sl-itsl-course-files-page>`
} satisfies Meta<Props>;

/** The design as drawn: the full 1280x768 "Save course materials" screen. */
export const Basic: Story = {};

/**
 * An empty result set. The table renders its header and no rows, and the pagination collapses to
 * a single page — the state a search with no matches lands on.
 */
export const NoCourses: Story = {
  render: () =>
    html`<sl-itsl-course-files-page
      .data=${{
        nav: DEMO_NAV,
        title: DEMO_PAGE_TITLE,
        bannerText: DEMO_BANNER_TEXT,
        rows: [],
        pagination: { page: 1, pageSize: 10, totalItems: 0 }
      }}
    ></sl-itsl-course-files-page>`
};

/**
 * A later page of a larger set. Exercises the pagination's middle state — both chevrons enabled
 * and the selected page away from either end — which the design's still only shows at page 1.
 */
export const MiddlePage: Story = {
  render: () =>
    html`<sl-itsl-course-files-page
      .data=${{
        nav: DEMO_NAV,
        title: DEMO_PAGE_TITLE,
        bannerText: DEMO_BANNER_TEXT,
        rows: DEMO_ROWS,
        pagination: { page: 3, pageSize: 10, totalItems: 47 }
      }}
    ></sl-itsl-course-files-page>`
};
