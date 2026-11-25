import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { type NotificationManager } from './notification-manager.js';
import { createStore } from './notification.stories-utils.js';
import './register.js';

type Props = Pick<NotificationManager, 'closable'> & { read: number; unread: number };
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Notification/Notification manager',
  args: {
    closable: false,
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
  render: ({ closable, read, unread }) => html`
    <sl-notification-manager
      ?closable=${closable}
      .store=${createStore({ read, unread })}
      style="block-size: 480px; border: 1px solid var(--sl-color-border-plain); border-radius: var(--sl-size-borderRadius-default); max-inline-size: 400px"></sl-notification-manager>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Closable: Story = {
  args: {
    closable: true
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
