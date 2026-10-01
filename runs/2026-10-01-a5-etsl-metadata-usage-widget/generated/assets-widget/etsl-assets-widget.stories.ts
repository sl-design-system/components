import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { EtslAssetsWidget } from './etsl-assets-widget.js';
import { assetsWidgetMock } from './etsl-assets-widget.mock.js';

// This is a level-0 child: only the root `sl-etsl-dashboard-page` registers it globally, so its
// own story has to define it or nothing renders. `EtslAssetsWidget` is imported as a value (not
// `import type`) for exactly that reason - a type-only import is erased at transform time.
if (!customElements.get('sl-etsl-assets-widget')) {
  customElements.define('sl-etsl-assets-widget', EtslAssetsWidget);
}

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Assets widget',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-etsl-assets-widget .model=${assetsWidgetMock}></sl-etsl-assets-widget>`
} satisfies Meta;

export const Basic: StoryObj = {};
