import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import: this is what actually runs `customElements.define`. A
// `import { type X } from './etsl-dashboard-page.js'` is erased at transform time, and the
// element would sit in the DOM at 0x0 with no shadow root.
import './etsl-dashboard-page.js';
import { ETSL_DASHBOARD_DATA } from './mock-data.js';

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Dashboard page',
  parameters: { layout: 'fullscreen' },
  // No args: the root defaults its `data` to the design's own content, which is the acceptance
  // bar for this run.
  render: () => html`<sl-etsl-dashboard-page></sl-etsl-dashboard-page>`
} satisfies Meta;

export const Basic: StoryObj = {};

/**
 * The same shell with every collection emptied — the eight cards, their headers and their
 * "Remove widget" actions all still render, which is what proves the card shell is independent
 * of the data it frames.
 */
export const EmptyDashboard: StoryObj = {
  render: () => html`
    <sl-etsl-dashboard-page
      .data=${{
        ...ETSL_DASHBOARD_DATA,
        assetsTotal: 0,
        assetRequestCount: 0,
        contentItemsTotal: 0,
        productIds: [],
        assets: { types: [] },
        contentItems: { metrics: [] },
        recentlyEdited: { entries: [] },
        metadataUsage: { totals: { total: 0, used: 0, unused: 0 }, entries: [] },
        recentlyPublished: { publications: [] },
        reusedContent: { sourceItems: [], linkedItems: [] }
      }}
    ></sl-etsl-dashboard-page>
  `
};
