import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Value import (not `type`): a `type` import is erased at transform time and the class would
// never reach `customElements.define` below.
import { EtslAppHeader } from './etsl-app-header.js';
import { appHeaderMock } from './etsl-app-header.mock.js';

// This is a scoped child of the dashboard page and does not register itself. Its own story has
// to register it so it renders standalone.
customElements.get('sl-etsl-app-header') ||
  customElements.define('sl-etsl-app-header', EtslAppHeader);

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/App header',
  parameters: { layout: 'fullscreen' },
  render: () =>
    html`<sl-etsl-app-header active-tab="dashboard" .model=${appHeaderMock}></sl-etsl-app-header>`
} satisfies Meta;

export const Basic: StoryObj = {};
