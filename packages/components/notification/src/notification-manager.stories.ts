import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { type NotificationManager } from './notification-manager.js';
import { createStore, renderAppHeader, styles } from './notification.stories-utils.js';
import './register.js';

type Props = Pick<NotificationManager, 'drawerBelow' | 'fullscreenBelow'> & {
  read: number;
  unread: number;
};
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Notification/Notification manager',
  args: {
    drawerBelow: 1024,
    fullscreenBelow: 600,
    read: 14,
    unread: 3
  },
  argTypes: {
    read: {
      control: { type: 'number', min: 0, max: 50 }
    },
    unread: {
      control: { type: 'number', min: 0, max: 20 }
    }
  },
  render: ({ drawerBelow, fullscreenBelow, read, unread }) => {
    const store = createStore({ read, unread });

    return html`
      ${styles}
      <header class="app-header">
        <strong>Lesplanner</strong>
        <sl-notification-button .store=${store} manager="manager-inbox"></sl-notification-button>
      </header>
      <sl-notification-manager
        .drawerBelow=${drawerBelow}
        .fullscreenBelow=${fullscreenBelow}
        .store=${store}
        id="manager-inbox"></sl-notification-manager>
      <p>
        Use the bell to open the manager. It is a popover from ${drawerBelow}px wide, a drawer below
        that and full screen below ${fullscreenBelow}px.
      </p>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Drawer: Story = {
  args: {
    drawerBelow: 10000
  }
};

export const FullScreen: Story = {
  args: {
    fullscreenBelow: 10000
  }
};

export const NothingUnread: Story = {
  args: {
    unread: 0
  }
};

export const NoHistory: Story = {
  args: {
    read: 0,
    unread: 0
  }
};

export const DocumentStore: Story = {
  render: () => html`
    ${styles} ${renderAppHeader('document-inbox')}
    <p>This manager shows the document's store, used by the Example story.</p>
  `
};
