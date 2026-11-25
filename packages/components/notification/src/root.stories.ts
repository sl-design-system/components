import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { renderAppHeader, renderControls, styles } from './notification.stories-utils.js';
import './register.js';

type Story = StoryObj;

export default {
  title: 'Feedback & status/Notification'
} as Meta;

/**
 * All notification components together, using the document's store: `Notification.add()` inserts
 * the stack automatically, the button shows the unread count and opens the manager.
 */
export const Example: Story = {
  render: () => html`
    ${styles} ${renderAppHeader('example-inbox')} ${renderControls()}
    <p>
      Send several: they pile up; hover, Tab in or click the edges to expand. Press F8 to jump to
      the newest notification. Errors and notifications with an action stay until dismissed. Use the
      bell to see the history.
    </p>
  `
};
