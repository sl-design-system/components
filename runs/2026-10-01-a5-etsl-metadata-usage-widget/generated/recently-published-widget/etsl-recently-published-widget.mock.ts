import { type RecentlyPublishedWidgetModel } from './etsl-recently-published-widget.js';

/**
 * The three publication runs shown in the Figma design, verbatim — including the `_test` suffixes
 * and the `dd-mm-yyyy at HH:mm` date shape.
 *
 * In the real application the dashboard page fetches this; a fetch goes here. The root's
 * `mock-data.ts` re-exports this fixture as `recentlyPublished`.
 */
export const recentlyPublishedWidgetMock: RecentlyPublishedWidgetModel = {
  publications: [
    {
      id: 'pub-1',
      name: 'Publication 1',
      environment: 'SPKampus publication-kampus',
      publishedAt: '23-10-2024 at 14:30',
      status: 'success'
    },
    {
      id: 'pub-2',
      name: 'Publication 2_test publication',
      environment: 'SPKampus publication-kampus-2',
      publishedAt: '23-10-2024 at 12:30',
      status: 'success'
    },
    {
      id: 'pub-3',
      name: 'Publication 3_test publication',
      environment: 'SPKampus publication-kampus-dev3',
      publishedAt: '12-09-2024 at 14:45',
      status: 'failure'
    }
  ]
};
