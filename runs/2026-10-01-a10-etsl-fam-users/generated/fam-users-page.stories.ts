import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// A plain side-effect import: THIS is what runs `customElements.define`. A
// `import { type FamUsersPage } from './fam-users-page.js'` is erased at transform time, and so
// is a value import whose binding is only used in a type position - the module would never run,
// and the element would sit in the DOM at 0x0 with no shadow root while the type check passed.
import './fam-users-page.js';

export default {
  title: 'Runs/A10 ETSL FAM Users/FAM users page',
  parameters: { layout: 'fullscreen' },
  // No args: the root defaults to the design's own content, which is the acceptance bar.
  render: () => html`<sl-a10-fam-users-page></sl-a10-fam-users-page>`
} satisfies Meta;

/** The design exactly as drawn: three users, Login sorted ascending, 25 rows per page. */
export const Basic: StoryObj = {};

/**
 * Sorted descending on Login. Proves the header control is wired rather than decorative - the
 * design's own static mock-up cannot show this, and a still image of `Basic` cannot distinguish
 * a working sort from a painted glyph.
 */
export const SortedDescending: StoryObj = {
  play: async ({ canvasElement }) => {
    const table = canvasElement
      .querySelector('sl-a10-fam-users-page')!
      .shadowRoot!.querySelector('sl-a10-user-table')!;

    table.dispatchEvent(
      new CustomEvent('sl-a10-sort-change', {
        bubbles: true,
        composed: true,
        detail: { column: 'login', direction: 'desc' }
      })
    );
  }
};

/** A search term matching two of the three records: the table and the footer total both follow. */
export const Filtered: StoryObj = {
  play: async ({ canvasElement }) => {
    canvasElement
      .querySelector('sl-a10-fam-users-page')!
      .shadowRoot!.querySelector('sl-a10-user-filters')!
      .dispatchEvent(
        new CustomEvent('sl-a10-search-change', { bubbles: true, composed: true, detail: 'vanin' })
      );
  }
};

/**
 * A search matching nothing. The table keeps its header and its column widths while the body
 * empties, which is what proves the header is independent of the rows - and it exercises the
 * paginator's zero state, which the design never shows.
 */
export const NoResults: StoryObj = {
  play: async ({ canvasElement }) => {
    canvasElement
      .querySelector('sl-a10-fam-users-page')!
      .shadowRoot!.querySelector('sl-a10-user-filters')!
      .dispatchEvent(
        new CustomEvent('sl-a10-search-change', {
          bubbles: true,
          composed: true,
          detail: 'no-such-user'
        })
      );
  }
};

/**
 * Two rows per page, so both paginator arrows become live and the status reads "1-2 of 3".
 * In the design both arrows are disabled, so this is the only way to see the enabled treatment.
 */
export const PagedTwoPerPage: StoryObj = {
  play: async ({ canvasElement }) => {
    canvasElement
      .querySelector('sl-a10-fam-users-page')!
      .shadowRoot!.querySelector('sl-a10-user-table')!
      .dispatchEvent(
        new CustomEvent('sl-a10-page-size-change', { bubbles: true, composed: true, detail: 2 })
      );
  }
};

/**
 * One of the three tabs the design supplies no content for. The strip stays live and the body is
 * empty - no invented placeholder, which would be fabricated content (OQ-9).
 */
export const EmptyTab: StoryObj = {
  play: async ({ canvasElement }) => {
    canvasElement
      .querySelector('sl-a10-fam-users-page')!
      .shadowRoot!.querySelector('sl-a10-page-header')!
      .dispatchEvent(
        new CustomEvent('sl-a10-tab-change', {
          bubbles: true,
          composed: true,
          detail: 'downtime-events'
        })
      );
  }
};
