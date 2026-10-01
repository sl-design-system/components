import { type Button } from '@sl-design-system/button';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { userEvent } from 'storybook/test';
import { type SubchapterFeedHeader } from './feed-header/subchapter-feed-header.js';
// Plain side-effect import so `sl-subchapter-feed-page` actually registers - a type-only import
// would be erased at transform time and the element would never be defined.
import './subchapter-feed-page.js';
import { type SubchapterFeedPage } from './subchapter-feed-page.js';
import { type KampusTocSidebar } from './toc-sidebar/kampus-toc-sidebar.js';

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/Subchapter feed page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-subchapter-feed-page></sl-subchapter-feed-page>`
} satisfies Meta;

export const Basic: StoryObj = {};

/**
 * `studentView` is `@state`-only on the root (no public property), so this story drives it the
 * same way a real user would: it clicks the "Student view" switch in the feed header. The click
 * emits `sl-student-view-change`, which the root handles by flipping its own `studentView` on and
 * passing it down to the feed header and feed list, whose teacher-only affordances then hide
 * behind `actionsHidden`.
 */
export const StudentViewOn: StoryObj = {
  play: async ({ canvasElement }) => {
    const page = canvasElement.querySelector('sl-subchapter-feed-page') as SubchapterFeedPage;
    await page.updateComplete;

    const header = page.shadowRoot?.querySelector('sl-subchapter-feed-header') as SubchapterFeedHeader;
    const toggle = header.shadowRoot?.querySelector('sl-switch') as HTMLElement;

    // Clicking the `sl-switch` host directly (rather than an element inside its own shadow root)
    // matters: the switch only toggles when the click's `composedPath()[0]` is the host itself.
    await userEvent.click(toggle);

    await header.updateComplete;
    await page.updateComplete;
  }
};

/**
 * `tocOpen` is `@state`-only on the root (no public property), so this story drives it the same
 * way a real user would: it clicks the ToC sidebar's close (x) button. The click emits
 * `sl-toc-close`, which the root handles by flipping its own `tocOpen` off, removing the sidebar
 * so the content column grows into its 360px.
 */
export const TocCollapsed: StoryObj = {
  play: async ({ canvasElement }) => {
    const page = canvasElement.querySelector('sl-subchapter-feed-page') as SubchapterFeedPage;
    await page.updateComplete;

    const toc = page.shadowRoot?.querySelector('sl-kampus-toc-sidebar') as KampusTocSidebar;
    const closeButton = toc.shadowRoot?.querySelector('sl-button[aria-label="Close"]') as Button;
    const innerButton = closeButton.shadowRoot?.querySelector('button') as HTMLButtonElement;

    await userEvent.click(innerButton);

    await page.updateComplete;
  }
};

/**
 * `activeFilter` is `@state`-only on the root (no public property), so this story drives it the
 * same way a real user would: it clicks the "Exercise" filter pill. The click emits
 * `sl-feed-filter-change`, which the root handles by setting its own `activeFilter` to
 * `'exercise'` and passing it down as `selectedFilter` to the feed header, which reflects it as
 * the checked radio pill.
 *
 * Known gap (see report): the root never forwards `activeFilter` to `sl-subchapter-feed-list`, so
 * this only changes which pill is checked - the feed's own content is not actually filtered.
 */
export const FilteredToExercises: StoryObj = {
  play: async ({ canvasElement }) => {
    const page = canvasElement.querySelector('sl-subchapter-feed-page') as SubchapterFeedPage;
    await page.updateComplete;

    const header = page.shadowRoot?.querySelector('sl-subchapter-feed-header') as SubchapterFeedHeader;
    const pills = header.shadowRoot?.querySelectorAll<HTMLButtonElement>('.filter-pill') ?? [];
    const exercisePill = Array.from(pills).find(pill => pill.textContent?.includes('Exercise'));

    await userEvent.click(exercisePill as HTMLButtonElement);

    await header.updateComplete;
    await page.updateComplete;
  }
};
