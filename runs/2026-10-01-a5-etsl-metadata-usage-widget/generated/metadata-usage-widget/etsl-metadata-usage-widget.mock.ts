import { type MetadataUsageWidgetModel } from './etsl-metadata-usage-widget.js';

/**
 * The design's verbatim content for the "Metadata Usage" widget. In the real app this slice is
 * owned by `sl-etsl-dashboard-page`, which fetches the whole dashboard payload; the root's
 * `mock-data.ts` imports this fixture as its `metadataUsage`.
 */
export const metadataUsageWidgetMock: MetadataUsageWidgetModel = {
  totals: { total: 2916, used: 2409, unused: 507 },
  entries: [
    { id: 'product-id', category: 'General settings', field: 'Product ID', usage: 88 },
    { id: 'demo-product', category: 'General settings', field: 'Demo product', usage: 47 },
    { id: 'subject', category: 'General settings', field: 'Subject', usage: 12 },
    { id: 'cover-image-slice', category: 'General settings', field: 'Cover image slice', usage: 7 },
    { id: 'combi-content', category: 'Feed settings', field: 'Combi content', usage: null },
    { id: 'hide-from-feed', category: 'Feed settings', field: 'Hide from feed', usage: null }
  ]
};
