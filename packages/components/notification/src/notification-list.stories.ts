import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { type NotificationList } from './notification-list.js';
import { createStore } from './notification.stories-utils.js';
import './register.js';

type Props = Pick<NotificationList, 'pageSize'> & { read: number; unread: number };
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Notification/Notification list',
  args: {
    pageSize: 10,
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
  render: ({ pageSize, read, unread }) => html`
    <sl-notification-list
      .pageSize=${pageSize}
      .store=${createStore({ read, unread })}
      style="border: 1px solid var(--sl-color-border-plain); max-inline-size: 400px"></sl-notification-list>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

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
