import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Value import, not a type-only one: a type-only import is erased at transform time and the
// class would never reach `customElements.define` below.
import { EtslRecentlyEditedWidget } from './etsl-recently-edited-widget.js';
import { recentlyEditedWidgetMock } from './etsl-recently-edited-widget.mock.js';

// This is a level-0 child of `sl-etsl-dashboard-page`, so it does not register itself - only the
// root does. Register it here so this story renders it standalone.
customElements.get('sl-etsl-recently-edited-widget') ||
  customElements.define('sl-etsl-recently-edited-widget', EtslRecentlyEditedWidget);

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Recently edited widget',
  parameters: { layout: 'fullscreen' },
  // The widget card is 588px wide in the design and the root owns that dimension; the wrapper
  // reproduces it so the standalone story shows the design's column proportions.
  render: () => html`
    <div style="inline-size: 588px">
      <sl-etsl-recently-edited-widget
        .model=${recentlyEditedWidgetMock}></sl-etsl-recently-edited-widget>
    </div>
  `
} satisfies Meta;

export const Basic: StoryObj = {};

/** No entries — the header row stays, the body is empty. */
export const Empty: StoryObj = {
  render: () => html`
    <div style="inline-size: 588px">
      <sl-etsl-recently-edited-widget
        .model=${{ entries: [] }}
      ></sl-etsl-recently-edited-widget>
    </div>
  `
};
