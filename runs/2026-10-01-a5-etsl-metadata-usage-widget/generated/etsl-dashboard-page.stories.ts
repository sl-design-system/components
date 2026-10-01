import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import: this is what actually runs `customElements.define`. A
// `import { type X } from './etsl-dashboard-page.js'` is erased at transform time, and the
// element would sit in the DOM at 0x0 with no shadow root.
import './etsl-dashboard-page.js';

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Dashboard page',
  parameters: { layout: 'fullscreen' },
  // No args: the root defaults its `data` to the design's own content, which is the acceptance
  // bar for this run.
  render: () => html`<sl-etsl-dashboard-page></sl-etsl-dashboard-page>`
} satisfies Meta;

export const Basic: StoryObj = {};
