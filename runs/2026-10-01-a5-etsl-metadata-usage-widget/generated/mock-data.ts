import { appHeaderMock } from './app-header/etsl-app-header.mock.js';
import { assetsWidgetMock } from './assets-widget/etsl-assets-widget.mock.js';
import { contentItemsWidgetMock } from './content-items-widget/etsl-content-items-widget.mock.js';
import { type EtslDashboardData } from './etsl-dashboard-page.js';
import { metadataUsageWidgetMock } from './metadata-usage-widget/etsl-metadata-usage-widget.mock.js';
import { recentlyEditedWidgetMock } from './recently-edited-widget/etsl-recently-edited-widget.mock.js';
import { recentlyPublishedWidgetMock } from './recently-published-widget/etsl-recently-published-widget.mock.js';
import { reusedContentWidgetMock } from './reused-content-widget/etsl-reused-content-widget.mock.js';

/**
 * The Functional management → Dashboard screen exactly as the Figma frame renders it.
 *
 * The page root owns this data: each of the seven presentational children gets its own slice,
 * and the root adds the content it renders itself (the two header metrics, the descriptive
 * metadata card and the product id list).
 *
 * // TODO: replace with fetch('/api/etsl/functional-management/dashboard')
 */
export const ETSL_DASHBOARD_DATA: EtslDashboardData = {
  header: appHeaderMock,

  // Rendered by the root, in the Assets card header.
  assetsTotal: 39,
  assetRequestCount: 4,
  assets: assetsWidgetMock,

  // Rendered by the root, in the Content items card header. The 26 bar counts sum to 166; the
  // design's header reads 164. Kept verbatim — see manifest OQ16.
  contentItemsTotal: 164,
  contentItems: contentItemsWidgetMock,

  descriptiveMetadata: {
    created: '24-10-2024',
    author: 'ETSLTeam PM',
    // The design reads "6-11-20244". Transcribed verbatim, typo included.
    lastUpdated: '6-11-20244',
    lastUpdatedBy: 'Xavier Mitchell',
    outlineTemplateLastUpdated: '24-10-2024',
    language: 'English'
  },

  // Six identical ids in the design's two-column list.
  productIds: ['5678976', '5678976', '5678976', '5678976', '5678976', '5678976'],

  recentlyEdited: recentlyEditedWidgetMock,
  metadataUsage: metadataUsageWidgetMock,
  recentlyPublished: recentlyPublishedWidgetMock,
  reusedContent: reusedContentWidgetMock
};
