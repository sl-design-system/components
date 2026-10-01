import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Value import, not a type-only one: a type-only import is erased at transform time and the
// class would never reach `customElements.define` below.
import { EtslReusedContentWidget } from './etsl-reused-content-widget.js';
import { reusedContentWidgetMock } from './etsl-reused-content-widget.mock.js';

// This is a level-0 child of `sl-etsl-dashboard-page`, so it does not register itself - only the
// root does. Register it here so this story renders it standalone.
customElements.get('sl-etsl-reused-content-widget') ||
  customElements.define('sl-etsl-reused-content-widget', EtslReusedContentWidget);

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Reused content widget',
  parameters: { layout: 'fullscreen' },
  // The widget card is 588px wide in the design and the root owns that dimension; the wrapper
  // reproduces it so the standalone story shows the design's column proportions and the wrap
  // that makes the first row 88px tall.
  render: () => html`
    <div style="inline-size: 588px">
      <sl-etsl-reused-content-widget
        .model=${reusedContentWidgetMock}></sl-etsl-reused-content-widget>
    </div>
  `
} satisfies Meta;

export const Basic: StoryObj = {};

/**
 * The second tab. The Figma frame has no content for it (OQ6), so the widget renders its
 * empty-state row. This is the variant that shows the chosen default rather than leaving it
 * undocumented.
 */
export const LinkedItemsTab: StoryObj = {
  render: () => html`
    <div style="inline-size: 588px">
      <sl-etsl-reused-content-widget
        .model=${reusedContentWidgetMock}
        active-tab="linked-items"
      ></sl-etsl-reused-content-widget>
    </div>
  `
};
