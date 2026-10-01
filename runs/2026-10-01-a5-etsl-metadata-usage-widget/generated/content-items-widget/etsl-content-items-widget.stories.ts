import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { EtslContentItemsWidget } from './etsl-content-items-widget.js';
import { contentItemsWidgetMock } from './etsl-content-items-widget.mock.js';

// Only the root `sl-etsl-dashboard-page` registers globally; this level-0 child is otherwise
// reached through the root's `scopedElements`. Register it here so the story renders.
customElements.get('sl-etsl-content-items-widget') ||
  customElements.define('sl-etsl-content-items-widget', EtslContentItemsWidget);

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Content items widget',
  parameters: { layout: 'fullscreen' },
  // The root's card shell supplies the 588px width, the white surface and the `--etsl-color-*`
  // palette; standalone, the widget falls back to the two run-local colours in its stylesheet.
  render: () => html`
    <div style="inline-size: 588px; background: var(--sl-color-palette-grey-000);">
      <sl-etsl-content-items-widget .model=${contentItemsWidgetMock}></sl-etsl-content-items-widget>
    </div>
  `
} satisfies Meta;

export const Basic: StoryObj = {};
