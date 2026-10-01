import { type ReusedContentWidgetModel } from './etsl-reused-content-widget.js';

/**
 * The "Reused content" rows exactly as the Figma design shows them, including the U+2212 minus
 * sign the designer typed in "FyKe 7−9". In the real dashboard this slice comes from the root
 * `sl-etsl-dashboard-page`, which owns the fetch; the root's `mock-data.ts` re-exports this
 * fixture as its `reusedContent` field.
 *
 * `linkedItems` is empty because the design never shows the second tab's content: the Figma
 * frame only contains the "Outlines with source items" table. The widget renders its empty state
 * rather than inventing rows.
 */
export const reusedContentWidgetMock: ReusedContentWidgetModel = {
  sourceItems: [
    {
      id: 'outline-1',
      outlineName: 'Outline 1',
      projectName: 'FyKe 7−9 Fysiikka VII Maailmankaikkeuden suuret',
      linkedItemCount: 15
    },
    {
      id: 'outline-2',
      outlineName: 'Outline 2',
      projectName: 'Taalblokken Engels',
      linkedItemCount: 2
    },
    {
      id: 'outline-3',
      outlineName: 'Outline 3',
      projectName: 'Taalblokken Engels',
      linkedItemCount: 1
    },
    {
      id: 'outline-4',
      outlineName: 'Outline 4',
      projectName: 'Taalblokken Engels',
      linkedItemCount: 1
    },
    {
      id: 'outline-5',
      outlineName: 'Outline 5',
      projectName: 'Taalblokken Engels',
      linkedItemCount: 1
    }
  ],
  linkedItems: []
};
