import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { EtslRecentlyPublishedWidget } from './etsl-recently-published-widget.js';
import { recentlyPublishedWidgetMock } from './etsl-recently-published-widget.mock.js';

// This is a level-0 child: only the dashboard page registers globally, so the story registers the
// element itself. A `import { type ... }` would be erased at transform time and never define it.
customElements.get('sl-etsl-recently-published-widget') ||
  customElements.define('sl-etsl-recently-published-widget', EtslRecentlyPublishedWidget);

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Recently published widget',
  parameters: { layout: 'fullscreen' },
  // 588px is this widget's width on the design's 1200px content column. The wrapping of the
  // header cells and of the longer name/environment values depends on that width, which on the
  // page comes from the root's card shell.
  render: () => html`
    <div style="inline-size: 588px;">
      <sl-etsl-recently-published-widget .model=${recentlyPublishedWidgetMock}></sl-etsl-recently-published-widget>
    </div>
  `
} satisfies Meta;

export const Basic: StoryObj = {};

/** Every run failed — three red badges with `triangle-exclamation-solid`. */
export const AllFailure: StoryObj = {
  render: () => html`
    <div style="inline-size: 588px">
      <sl-etsl-recently-published-widget
        .model=${{
          publications: recentlyPublishedWidgetMock.publications.map(p => ({
            ...p,
            status: 'failure' as const
          }))
        }}
      ></sl-etsl-recently-published-widget>
    </div>
  `
};

/** Every run succeeded — three green badges with `circle-check-solid`. */
export const AllSuccess: StoryObj = {
  render: () => html`
    <div style="inline-size: 588px">
      <sl-etsl-recently-published-widget
        .model=${{
          publications: recentlyPublishedWidgetMock.publications.map(p => ({
            ...p,
            status: 'success' as const
          }))
        }}
      ></sl-etsl-recently-published-widget>
    </div>
  `
};
