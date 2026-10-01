import { type RecentlyEditedWidgetModel } from './etsl-recently-edited-widget.js';

/**
 * The "Recently edited" rows exactly as the Figma design shows them, including the design's own
 * truncated "BA.." title. In the real dashboard this slice comes from the root
 * `sl-etsl-dashboard-page`, which owns the fetch; the root's `mock-data.ts` re-exports this
 * fixture as its `recentlyEdited` field.
 */
export const recentlyEditedWidgetMock: RecentlyEditedWidgetModel = {
  entries: [
    { id: 'choice', title: 'Choice', outlinePart: 'content-item', editedAt: '23-10-2024 at 14:30' },
    {
      id: 'teacher-talk',
      title: 'Teacher talk',
      outlinePart: 'content-item',
      editedAt: '23-10-2024 at 12:30'
    },
    {
      id: 'fill-in',
      title: 'Fill in',
      outlinePart: 'content-item',
      editedAt: '12-09-2024 at 14:56'
    },
    {
      id: 'kuuntele',
      title: 'Kuuntele ja harjoittele: BA..',
      outlinePart: 'section',
      editedAt: '12-09-2024 at 14:45'
    },
    { id: 'footprint', title: 'Footprint', outlinePart: 'section', editedAt: '12-09-2024 at 11:20' },
    { id: 'fit-life', title: 'Fit life', outlinePart: 'section', editedAt: '12-09-2024 at 11:20' }
  ]
};
