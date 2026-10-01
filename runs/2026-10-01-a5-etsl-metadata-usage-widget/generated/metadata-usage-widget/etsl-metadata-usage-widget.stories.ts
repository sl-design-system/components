import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { metadataUsageWidgetMock } from './etsl-metadata-usage-widget.mock.js';
import { EtslMetadataUsageWidget } from './etsl-metadata-usage-widget.js';

// This is a level-0 child: only the `sl-etsl-dashboard-page` root registers globally, so the
// element has to be defined here for the story to render anything. A `import { type X }` would
// be erased at transform time, hence the value import above.
customElements.get('sl-etsl-metadata-usage-widget') ||
  customElements.define('sl-etsl-metadata-usage-widget', EtslMetadataUsageWidget);

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Metadata usage widget',
  parameters: { layout: 'fullscreen' },
  // The widget body is fluid; in the page it sits inside a 588px wide card. The wrapper
  // reproduces that measured width and the card's white surface so the standalone story matches
  // the design - the component itself sets no width.
  render: () => html`
    <div
      style="background: var(--sl-color-palette-grey-000); inline-size: 588px; padding-block: var(--sl-space-200);"
    >
      <sl-etsl-metadata-usage-widget .model=${metadataUsageWidgetMock}></sl-etsl-metadata-usage-widget>
    </div>
  `
} satisfies Meta;

export const Basic: StoryObj = {};
